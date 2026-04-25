# Supabase Setup Instructions

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the details:
   - **Name**: job-admin-dashboard
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
4. Wait for the project to be created (may take a minute)

## Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Example:

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Set Up Database Tables

Run the following SQL in your Supabase **SQL Editor**:

### Create Jobs Table

```sql
-- Create jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  salary TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT DEFAULT 'Full-time',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Enable all for authenticated users" ON jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

### Create Saved Jobs Table

```sql
-- Create saved_jobs table
CREATE TABLE saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Enable all for authenticated users" ON saved_jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

## Step 5: Create Admin User

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Enter an email and password
4. Click "Create user"

This user can now log in to the admin dashboard.

## Step 6: Test Your Setup

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open http://localhost:5173
3. Log in with the admin credentials you created

---

## Troubleshooting

### "Invalid login credentials"

- Check that the user was created in Supabase Authentication
- Verify your `.env` file has the correct URL and anon key

### "relation does not exist"

- Make sure you ran the SQL in the Supabase SQL Editor
- Check that the tables were created successfully

### CORS errors

- Ensure your Supabase project URL is correct in `.env`
- Check that your project is not paused (free tier limitation)
