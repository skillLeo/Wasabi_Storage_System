# Claude Build Prompt — No1LeftBehind Employee Document Upload Portal

---

## Read This First

Before writing a single line of code, read the `claude.md` file located in the root of this project. That file contains the full project brief, client requirements, all pages to build, design rules, and what is out of scope. Everything you build must stay within what is described in that file.

---

## Project Structure Already Set Up

The folder structure is already in place. Do not change it, do not rename folders, do not create a new project.

```
No1LeftBehind/
├── frontend/      ← Next.js project (already installed)
├── backend/       ← Laravel project (already installed)
└── claude.md      ← Project brief (read before starting)
```

Work only inside the `frontend` and `backend` folders. Never touch or restructure the root.

---

## Your Role

You are a senior full stack developer. You are building a complete, production-quality private employee document portal from scratch inside the existing project structure. You write clean, well-organized, and maintainable code. You do not take shortcuts. You do not skip features. You do not leave placeholders or TODOs unless absolutely necessary and clearly marked.

---

## Tech Stack — Stick to This Exactly

- **Backend** — Laravel (PHP), REST API only, no Blade views, no server-side rendering
- **Frontend** — Next.js with React, App Router, Tailwind CSS for styling
- **Database** — MySQL
- **File Storage** — Wasabi S3 using the AWS SDK via Laravel. Credentials will come from the `.env` file. Build the integration fully but leave the actual keys as empty env variables for the client to fill in later.
- **Authentication** — Laravel Sanctum for API token-based auth
- **HTTP Client** — Axios on the frontend for all API calls

---

## Design Rules — Follow These Without Exception

- Background is always white
- Text is always dark, near black
- Accent color is cool blue — use hex `#2563EB` as the primary brand color throughout
- Font should be clean and modern — use Inter from Google Fonts
- Every single page must be fully responsive — desktop, tablet, and mobile
- The UI must be simple enough for non-technical employees to use without training
- No unnecessary complexity, no heavy animations, no dark mode
- Use a placeholder text logo that says **No1LeftBehind** in bold dark text for now. The client will replace it later.
- Design must feel professional, calm, and trustworthy — this is an HR document system

---

## Backend Instructions (Laravel — inside /backend)

### Environment Setup
- Set up the `.env` file with MySQL database connection
- Add Wasabi S3 credentials as empty placeholders:
  - `WASABI_ACCESS_KEY_ID`
  - `WASABI_SECRET_ACCESS_KEY`
  - `WASABI_DEFAULT_REGION`
  - `WASABI_BUCKET`
  - `WASABI_ENDPOINT`
- Configure Laravel Sanctum for API authentication

### Database — Create These Migrations

**users table**
- id, name, email, password, role (enum: admin or employee), is_active (boolean, default true), timestamps

**slots table**
- id, name, timestamps

**user_slots table** (pivot table linking users to slots)
- id, user_id, slot_id, file_path (nullable, stored Wasabi path), file_name (nullable, original file name), uploaded_at (nullable timestamp), timestamps

### API Routes to Build (all under /api)

**Auth**
- POST /api/login — accepts email and password, returns token and role
- POST /api/logout — revokes token

**Admin — Slots**
- GET /api/admin/slots — list all slots
- POST /api/admin/slots — create a new slot, auto-assign it as missing to all existing users
- PUT /api/admin/slots/{id} — rename a slot, update name in all user_slots
- DELETE /api/admin/slots/{id} — delete slot, remove from all user_slots and delete files from Wasabi

**Admin — Users**
- GET /api/admin/users — list all employees with completion percentage
- POST /api/admin/users — create employee account, auto-assign all current slots as missing
- PUT /api/admin/users/{id} — update employee info or deactivate
- DELETE /api/admin/users/{id} — delete employee and remove all their files from Wasabi
- GET /api/admin/users/{id}/slots — get full slot detail for a specific employee

**Employee**
- GET /api/employee/slots — get all slots assigned to the logged in employee with status and pre-signed URL if uploaded
- POST /api/employee/slots/{slotId}/upload — upload a file, send to Wasabi, store path in user_slots, delete old file from Wasabi if one exists

**Wasabi Integration**
- Use the AWS SDK for PHP (`aws/aws-sdk-php`) via Composer
- Configure a custom endpoint pointing to Wasabi in the S3 client config
- On upload: send file to Wasabi, save the file path in user_slots
- On preview or download: generate a pre-signed URL with 20 minute expiry
- On file replace: delete the old file from Wasabi first, then upload the new one
- On slot delete or user delete: delete all related files from Wasabi

**Completion Percentage Logic**
- Calculate as: (count of user_slots where file_path is not null) divided by (total count of user_slots for that user) multiplied by 100
- Return this value whenever employee or user data is returned from the API

**Middleware and Security**
- Protect all /api/admin routes with auth:sanctum and a middleware that checks role is admin
- Protect all /api/employee routes with auth:sanctum and a middleware that checks role is employee
- Employees must never be able to access another employee's data

---

## Frontend Instructions (Next.js — inside /frontend)

### Setup
- Install and configure Tailwind CSS if not already done
- Install Axios for API calls
- Set the backend API base URL in an environment variable `NEXT_PUBLIC_API_URL`
- Use Next.js App Router
- Store the auth token in an httpOnly cookie or localStorage with a clear auth context using React Context API
- Create a global auth guard that redirects unauthenticated users to login and redirects users to the correct panel based on their role

### Pages to Build

**Login Page — route: /**
- Clean centered card layout on a white background
- Logo at the top (placeholder text logo)
- Email and password fields
- Login button in brand blue
- On success redirect admin to /admin/dashboard and employee to /employee/documents
- Show clear error message on failed login

**Admin — Dashboard — route: /admin/dashboard**
- Show a page title and a summary count at the top (total employees, fully complete, incomplete)
- Main content is a table listing every employee
- Each row shows: employee full name, completion percentage as a visual progress bar plus number, list of missing slot names, last upload date and time
- Table must be sortable by name and by completion percentage
- Each row is clickable and navigates to that employee's detail page
- Must look clean and scannable at a glance

**Admin — Slot Management — route: /admin/slots**
- Show all current slots in a clean list
- Each slot shows its name with an edit button and a delete button
- At the top there is an input field and an add button to create a new slot
- Inline editing — clicking edit turns the slot name into an editable input
- Delete asks for confirmation before sending the request
- Show a success or error toast notification after every action

**Admin — User Management — route: /admin/users**
- Show all employees in a table with name, email, status (active or inactive), and action buttons
- A button at the top opens a modal or form to add a new employee
- New employee form: name, email, temporary password
- Each row has a deactivate or delete button
- Show confirmation before delete
- Show success or error toast after every action

**Admin — Employee Detail — route: /admin/users/[id]**
- Show the employee's name and overall completion percentage at the top
- Below that show every slot in a card or table layout
- Each slot shows: slot name, status badge (missing in red or grey, uploaded in green), upload date if available, and file preview
- For images show an inline thumbnail preview
- For PDFs show a clickable View Document button that opens the pre-signed URL in a new tab
- A back button returns to the dashboard

**Employee — My Documents — route: /employee/documents**
- Show the employee's name and a greeting at the top
- Directly below show a progress bar with text like "6 of 8 documents submitted — 75% complete"
- Below that show all slots in a responsive grid or list
- Each slot card shows: slot name, status badge, upload date if uploaded, file preview if uploaded
- Each slot has an upload button, if already uploaded it shows a re-upload button instead
- File input accepts JPG, JPEG, PNG, PDF only, max 10MB
- Show a loading state while uploading
- After upload the slot updates immediately without a full page reload
- Show a success or error toast after every action

### Shared Components to Build
- Navbar with logo, current user name, and logout button — shown on all pages after login
- Status badge component — red or grey for missing, green or blue for uploaded
- Progress bar component — reusable, takes a percentage value
- Toast notification component — success in green, error in red, auto-dismisses after 3 seconds
- Confirmation modal — reusable for delete actions
- Loading spinner for async actions

---

## Order of Development

Build in this exact order so everything connects properly.

1. Set up Laravel database migrations and run them
2. Seed one admin account for testing: email admin@no1leftbehind.com password Admin1234
3. Build Laravel auth endpoints (login, logout)
4. Build all admin API routes and controllers
5. Build all employee API routes and controllers
6. Build and test Wasabi integration with a test upload
7. Build the Next.js auth system, login page, and route guards
8. Build the admin dashboard and all admin pages
9. Build the employee documents page
10. Test the full flow end to end

---

## Important Rules

- Never expose file paths or Wasabi URLs directly in API responses — always use pre-signed URLs
- Never allow an employee to call any admin route — enforce this strictly on the backend
- Always validate file type and size on the backend, not just the frontend
- Always delete the old Wasabi file before replacing it with a new one
- All API responses must return consistent JSON with a clear structure
- If something in the brief is unclear, make the most reasonable professional decision and leave a short comment in the code explaining your choice
- Do not add any feature that is not described in claude.md — no email notifications, no registration, no GPS, no clock in or out

---

## Testing Accounts to Create via Seeder

- Admin: admin@no1leftbehind.com — password: Admin1234
- Employee 1: john@no1leftbehind.com — password: Employee1234
- Employee 2: sara@no1leftbehind.com — password: Employee1234
- Sample slots to seed: Passport Copy, Social Security Card, Driver License, Proof of Address

---

## Final Reminder

Read claude.md before starting. Build everything described. Build nothing extra. Keep the code clean. Keep the design professional. This portal handles sensitive employee documents — treat security seriously at every step.
