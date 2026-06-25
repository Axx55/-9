-- 3. Employee Specific Schema

-- Employee Profiles
CREATE TABLE employee_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    workplace_name VARCHAR(255),
    workplace_type VARCHAR(100)
);

-- Employee Absences
CREATE TABLE employee_absences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trip_id, user_id)
);

-- Trigger to validate employee account type
CREATE OR REPLACE FUNCTION check_employee_profile()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = NEW.user_id AND account_type = 'employee') THEN
        RAISE EXCEPTION 'User must have account_type employee';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_employee_profile
BEFORE INSERT OR UPDATE ON employee_profiles
FOR EACH ROW
EXECUTE FUNCTION check_employee_profile();
