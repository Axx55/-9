-- ==========================================
-- نظام إدارة الاشتراكات والرحلات - تطبيق العملاء
-- قاعدة بيانات محللة بالكامل لدعم التوسع
-- ==========================================

-- 1. جداول الإعدادات العامة (General Settings & Lookups)
CREATE TABLE account_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(50) NOT NULL, -- ولي أمر، موظف/ة، مؤسسة، طالب/طالبة
    name_en VARCHAR(50) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL, -- parent, employee, institution, student
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE education_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(50) NOT NULL, -- ابتدائي، متوسط، ثانوي، جامعي
    name_en VARCHAR(50) NOT NULL,
    level_order INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscription_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(50) NOT NULL, -- شهري، ترمي، سنوي
    name_en VARCHAR(50) NOT NULL,
    duration_days INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bank_name_ar VARCHAR(100) NOT NULL,
    bank_name_en VARCHAR(100) NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    iban VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جداول المواقع الجغرافية (Geographical Data)
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE neighborhoods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE schools_universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
    education_level_id UUID REFERENCES education_levels(id) ON DELETE SET NULL,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جداول المستخدمين والإدارة (Users & Management)
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- يمكن ربطها بـ auth.users لاحقاً
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(50) DEFAULT 'manager',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- يربط مع auth.users في Supabase
    account_type_id UUID REFERENCES account_types(id) ON DELETE RESTRICT,
    manager_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    home_latitude DECIMAL(10, 8),
    home_longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. جداول المركبات والسائقين (Vehicles & Drivers)
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL, -- حافلة صغيرة، حافلة كبيرة، فان
    color VARCHAR(30) NOT NULL,
    capacity INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE driver_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    assignment_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. جداول الاشتراكات (Subscriptions)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- بيانات المشترك (الابن/الموظف/الخ)
    subscriber_name VARCHAR(150) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    
    -- تفاصيل الوجهة
    trip_type VARCHAR(20) NOT NULL CHECK (trip_type IN ('go_only', 'return_only', 'go_and_return')),
    education_level_id UUID REFERENCES education_levels(id) ON DELETE SET NULL,
    neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
    school_university_id UUID REFERENCES schools_universities(id) ON DELETE SET NULL,
    
    -- مواقع مخصصة للمؤسسات
    custom_pickup_lat DECIMAL(10, 8),
    custom_pickup_lng DECIMAL(11, 8),
    custom_dropoff_lat DECIMAL(10, 8),
    custom_dropoff_lng DECIMAL(11, 8),
    custom_pickup_link TEXT,
    custom_dropoff_link TEXT,
    
    -- التوقيت
    go_time TIME,
    return_time TIME,
    
    -- نوع الاشتراك
    subscription_period_id UUID REFERENCES subscription_periods(id) ON DELETE RESTRICT,
    
    -- حالة الاشتراك
    status VARCHAR(30) DEFAULT 'under_review' 
        CHECK (status IN ('under_review', 'accepted_pending_payment', 'active', 'expired', 'cancelled', 'rejected')),
    
    -- التواريخ
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscription_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(subscription_id, day_of_week)
);

-- 6. جداول الفواتير والدفع (Invoices & Payments)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'under_review', 'paid', 'cancelled')),
    due_date DATE NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE,
    bank_id UUID REFERENCES banks(id) ON DELETE SET NULL,
    receipt_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. جداول الرحلات اليومية (Daily Trips)
CREATE TABLE daily_trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id) ON DELETE RESTRICT,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE RESTRICT,
    trip_date DATE NOT NULL,
    trip_direction VARCHAR(20) CHECK (trip_direction IN ('go', 'return')),
    status VARCHAR(30) DEFAULT 'not_started' 
        CHECK (status IN ('not_started', 'in_progress', 'completed', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE trip_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    daily_trip_id UUID REFERENCES daily_trips(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'on_the_way', 'arrived', 'absent')),
    status_updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(daily_trip_id, subscription_id)
);

-- المؤشرات (Indexes) لتحسين الأداء
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_invoices_subscription ON invoices(subscription_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_daily_trips_date ON daily_trips(trip_date);
CREATE INDEX idx_schools_neighborhood ON schools_universities(neighborhood_id);
