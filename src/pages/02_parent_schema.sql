-- 2. Parent Specific Schema

-- Students (Children)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    education_level VARCHAR(100),
    school_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent Subscriptions Details
CREATE TABLE parent_subscriptions (
    subscription_id UUID PRIMARY KEY REFERENCES subscriptions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE
);

-- Student Absences
CREATE TABLE student_absences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trip_id, student_id)
);

-- Function: Auto-create parent notification on child boarding
CREATE OR REPLACE FUNCTION notify_parent_on_board()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'boarded' AND OLD.status != 'boarded' THEN
        INSERT INTO notifications (user_id, title, message, type)
        SELECT s.user_id, 'ركوب الباص', 'ابنك صعد إلى الباص', 'trip'
        FROM subscriptions s
        WHERE s.id = NEW.subscription_id AND EXISTS (
            SELECT 1 FROM users WHERE id = s.user_id AND account_type = 'parent'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_parent_on_board
AFTER UPDATE OF status ON trips
FOR EACH ROW
EXECUTE FUNCTION notify_parent_on_board();
