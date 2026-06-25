-- 4. Institution Specific Schema

-- Institution Profiles
CREATE TABLE institution_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    industry VARCHAR(100)
);

-- Workers (Employees of the Institution)
CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Institution Subscriptions Details
CREATE TABLE institution_subscriptions (
    subscription_id UUID PRIMARY KEY REFERENCES subscriptions(id) ON DELETE CASCADE,
    individuals_count INTEGER NOT NULL DEFAULT 1
);

-- Subscription Workers (Mapping table)
CREATE TABLE subscription_workers (
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    PRIMARY KEY (subscription_id, worker_id)
);

-- Worker Absences (For trips)
CREATE TABLE worker_absences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trip_id, worker_id)
);

-- Function: Validate worker limit in subscription
CREATE OR REPLACE FUNCTION check_subscription_worker_limit()
RETURNS TRIGGER AS $$
DECLARE
    max_workers INTEGER;
    current_workers INTEGER;
BEGIN
    SELECT individuals_count INTO max_workers
    FROM institution_subscriptions
    WHERE subscription_id = NEW.subscription_id;

    SELECT COUNT(*) INTO current_workers
    FROM subscription_workers
    WHERE subscription_id = NEW.subscription_id;

    IF current_workers >= max_workers THEN
        RAISE EXCEPTION 'Cannot add more workers. Subscription limit reached.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_worker_limit
BEFORE INSERT ON subscription_workers
FOR EACH ROW
EXECUTE FUNCTION check_subscription_worker_limit();
