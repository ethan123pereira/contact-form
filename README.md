# Contact Form (Vercel + GitHub + Supabase)

```
contact-form/
├── index.html
├── style.css
├── script.js
├── supabase.sql
└── api/
    └── contact.js
```

## Steps

### 1. Database (Supabase, free)
1. Sign up at supabase.com and create a new project.
2. Open **SQL Editor**, paste the contents of `supabase.sql`, click **Run**.
3. Open **Project Settings > API**. Copy the **Project URL** and the **secret** (or `service_role`) key.

### 2. GitHub
1. Create a new repository named `contact-form` on github.com.
2. Upload all files (keep the `api` folder), or from a terminal:
   ```
   git init
   git add .
   git commit -m "Contact form"
   git branch -M main
   git remote add origin https://github.com/<your-username>/contact-form.git
   git push -u origin main
   ```

### 3. Vercel
1. Sign in at vercel.com with GitHub, click **Add New > Project**, import `contact-form`.
2. Before deploying, open **Environment Variables** and add:
   - `SUPABASE_URL` = your Project URL
   - `SUPABASE_KEY` = your secret key
3. Click **Deploy**. Open the live link.

### 4. Test
Submit the form, then open Supabase > **Table Editor > contact_messages** to see the row.

## Screenshots to include
1. Supabase project dashboard
2. SQL Editor with the table query run
3. Table structure (Table Editor, columns)
4. GitHub repository with all files
5. Vercel import screen and environment variables page (hide the key value)
6. Successful Vercel deployment
7. Live form (empty), form with validation errors, form filled, success message
8. Supabase table showing the submitted row
9. Mobile view of the live site
