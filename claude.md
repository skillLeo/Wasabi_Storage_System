# Claude Project Brief — No1LeftBehind Employee Document Upload Portal

## What Is This Project

This is a private internal web portal built for a company called No1LeftBehind. It is hosted at portal-no1leftbehind.us. The portal is not public. No one can register themselves. The entire system is controlled by an admin. The purpose of this portal is to allow the admin to define what documents employees need to submit, and then allow each employee to log in and upload their required documents into their assigned slots.

Think of it as a private HR document collection system where the admin sets everything up and employees simply show up, log in, and upload their paperwork.

---

## Who Are the Users

There are only two types of users in this system.

The first is the Admin. There is only one admin. The admin has full control. The admin creates the document slots, creates employee accounts, monitors who has submitted what, and can see everything across all employees.

The second is the Employee. Employees only see their own documents. They cannot see other employees, cannot access any admin area, and cannot do anything beyond uploading their own files. Their experience is intentionally simple.

---

## What the Client Wants

The client wants a clean, secure, and easy to use portal where:

- The admin can create named upload slots such as Passport Copy or Social Security Card
- Every employee automatically gets all current slots assigned to them when they are created
- When a new slot is added, all existing employees automatically get that slot added as missing
- Employees log in and upload files into their assigned slots
- The admin can see a dashboard showing every employee, how complete their profile is, what is missing, and when they last uploaded something
- All files are stored securely in Wasabi cloud storage, never permanently on the server
- File links are always temporary and expire after 15 to 30 minutes for security
- Employees can re-upload any file at any time and the old file gets deleted automatically
- The entire system must work perfectly on desktop, tablet, and mobile

---

## Tech Stack

The backend is Laravel written in PHP. The frontend is Next.js which is React based. The database is MySQL. File storage is Wasabi S3 which is compatible with the AWS SDK. Deployment will be on the client's VPS or cPanel hosting via SSH. For now we are building and testing everything locally. Deployment comes later.

---

## Pages to Build

There is one public page which is the Login page. Everyone lands here. After login the system checks the role and redirects accordingly. Admin goes to the admin dashboard. Employee goes to their personal documents page.

The admin has four pages. The first is the Main Dashboard which shows all employees, their completion percentage, what slots are still missing, and when they last uploaded. This page must be scannable at a glance. The second is Slot Management where the admin creates, edits, and deletes document slots. The third is User Management where the admin manually adds employees with a name, email, and temporary password. No self registration exists. The fourth is an Individual Employee Detail page where the admin can click on any employee and see all their slots, upload status, upload dates, and file previews.

The employee has one page called My Documents. This shows all their assigned slots with a status badge for each showing missing or uploaded, an upload button, file preview after upload, and a progress bar at the top showing their overall completion percentage.

---

## File Handling

Files go directly to Wasabi S3. The server never permanently stores files. When a file is needed for preview or download, Laravel generates a temporary pre-signed URL through Wasabi that expires in 15 to 30 minutes. Accepted file types are JPG, JPEG, PNG, and PDF. Maximum file size is 10MB per file. Employees can replace any uploaded file and the old one is deleted from Wasabi automatically.

---

## Completion Percentage Logic

Every slot counts equally. The percentage is calculated as the number of uploaded slots divided by the total assigned slots multiplied by 100. It updates automatically in real time whenever a file is uploaded or deleted. It shows on both the employee page and the admin dashboard.

---

## Design Requirements

The design must be clean, simple, professional, and calm. The background is white. Text is dark. The accent color is a cool blue. A placeholder logo will be used for now since the client has not yet provided the real logo or the exact blue hex code. These will be updated later when the client shares references. Every page must be fully responsive and must look and work perfectly on all screen sizes. The interface must be simple enough that non-technical employees can use it without training or confusion.

---

## What Is Not In This Project

Clock in and clock out is not included. GPS tracking is not included. Sandata integration is not included. Email notifications are not included. Public registration is not included. These are all confirmed for a future phase 2 and must not be built now.

---

## Current Status and Notes

We are building locally first. No deployment is needed yet. The client will provide Wasabi credentials, the real logo, and the blue color reference later. For now we use a placeholder logo and a suitable cool blue such as hex 2563EB as a stand-in. The Wasabi integration will be built properly but credentials will be plugged in by the client before going live. Design decisions made now are temporary and the client may request changes after seeing the reference materials.

---

## What We Are Delivering

A fully working local portal with both the admin panel and the employee panel functional. The Wasabi storage integration built and ready for credentials. All screens responsive across desktop tablet and mobile. Clean professional design matching the described brand style. Source code included and organized for easy handoff and future deployment.
