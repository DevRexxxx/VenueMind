# Updated Free Stack Deployment Guide for VenueMind

Since we have already pushed the production-ready code (including the Neon.tech database URL, WhiteNoise configuration, and `requirements.txt`) to your GitHub repository, the remaining deployment steps are very straightforward.

---

## Step 1: Deploy Backend on Render

1. Go to [Render.com](https://render.com/) and sign in with your GitHub account.
2. Click **New +** in the top right and select **Web Service**.
3. Connect the `VenueMind` GitHub repository.
4. Fill in the deployment details exactly as follows:
   * **Root Directory:** `backend`
   * **Environment:** `Python`
   * **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   * **Start Command:** `gunicorn venuemind_backend.wsgi:application`
   * **Instance Type:** Free
5. **Environment Variables:** Scroll down and add the following:
   * `SECRET_KEY`: (Create a long, random string, e.g., `django-insecure-prod-key-12345`)
   * `DEBUG`: `False`
   *(Note: You do not need to add the `DATABASE_URL` here because we successfully injected it into your `settings.py` locally before pushing).*
6. Click **Create Web Service**. 

> [!IMPORTANT]  
> **Database Migrations:** We added `&& python manage.py migrate` to the Build Command above. This is a neat trick that automatically applies your database tables to Neon.tech every time you deploy, bypassing the need for a premium Shell!

---

## Step 2: Deploy Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import the `VenueMind` GitHub repository.
4. Fill in the deployment details:
   * **Framework Preset:** Vercel should automatically detect **Next.js**.
   * **Root Directory:** If your Next.js app is at the root of the repo, leave this as `./`.
5. **Environment Variables:** You must tell Next.js where your new Render backend lives. Expand the Environment Variables section and add:
   * **Name:** `NEXT_PUBLIC_API_URL`
   * **Value:** `https://your-backend-app-name.onrender.com/api` (Replace with the actual URL Render gave you in Step 1).
6. Click **Deploy**. Vercel will build and publish your Next.js application in minutes.

---

## Step 3: Prevent Render from Sleeping

Render's free tier automatically spins down your backend if no one visits it for 15 minutes. To prevent long load times when it wakes up, you can keep it awake permanently.

1. Go to [cron-job.org](https://cron-job.org/) and create a free account.
2. Click **Create Cronjob**.
3. **URL:** Enter your Render backend URL (e.g., `https://your-backend-app-name.onrender.com/`).
4. **Execution Schedule:** Set it to run every **10 minutes**.
5. Save the job. Your backend will now stay awake 24/7!
