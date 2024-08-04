-- Drop the trigger
DROP TRIGGER IF EXISTS verify_email_domain_trigger ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS public.verify_email_domain();

-- Function to verify the email domain and existence
CREATE OR REPLACE FUNCTION public.verify_email_domain() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE
    email_exists BOOLEAN;
BEGIN
    -- Check if the email domain is correct
    IF (NEW.email ILIKE '%@student.monash.edu') THEN
        -- Check if the email already exists in the auth.users table
        SELECT EXISTS (
            SELECT 1 
            FROM auth.users 
            WHERE email = NEW.email
        ) INTO email_exists;

        IF email_exists THEN
            -- If the email exists, allow the insertion
            RETURN NEW;
        ELSE
            -- If the email does not exist, raise an exception
            RAISE EXCEPTION 'No account exists with this email.';
        END IF;
    ELSE
        -- If the email domain is incorrect, raise an exception to prevent the insertion
        RAISE EXCEPTION 'Wrong email domain.';
    END IF;
END;
$$;

-- Create a trigger to run the function before each insert operation on auth.users
CREATE TRIGGER verify_email_domain_trigger 
BEFORE INSERT ON auth.users 
FOR EACH ROW 
EXECUTE FUNCTION public.verify_email_domain();
