# Tadreeb Updates Summary

This file summarizes the main updates made recently across the Tadreeb MERN project.

## Authentication

- After student signup, the user is no longer logged in automatically.
- Signup now shows a confirmation dialog asking the student to confirm their information before creating the account.
- After successful signup, a short success loader appears, then the user is redirected to the login page.
- Login page shows a green success message when arriving from a successful signup.
- Signup redirect delay was increased to make the success state feel clearer.
- Student ID must be more than 6 characters.
- Password rules were strengthened and synchronized between frontend and backend:
  - 8-24 characters
  - at least one uppercase letter
  - at least one lowercase letter
  - at least one number
  - at least one special character
- Login, signup, student profile, company profile, admin profile, and admin add-user password fields now include show/hide eye toggles.
- Logout now asks for confirmation for student, company, and admin users.
- Logout now returns users to the public home page.
- Passwords are hashed on the backend with bcrypt before storage.
- Password fields are hidden by default in Student, Company, and Admin schemas and are selected only during login checks.

## Student Profile

- Student profile validation now matches signup rules for email, password, and Student ID.
- Header name/email no longer changes live while typing. It updates only after saving.
- Save Changes button is disabled until the student edits a profile field.
- The main email input was removed from the profile form.
- Email can now be updated from the My Email Address section.
- Email update flow includes Change Email, Update, and Cancel actions.
- Duplicate Student ID errors now appear under the Student ID field.
- Email update errors appear under the email field in red.
- Profile success toast was slowed down and stays visible longer.

## Programs And Applications

- Programs now have a separate `registrationDeadline` field.
- The registration deadline controls when students can apply or remove applications.
- New programs require a registration deadline.
- Registration deadline must be before the program start date.
- Older programs safely fall back to the day before the start date until edited.
- Program lifecycle display is now derived consistently:
  - Register Now: registration is still open
  - Active: program is currently running
  - Selection Phase: registration is closed and the program is not completed
  - Completed: company/admin manually marks it completed
- Seats no longer automatically mark a program as Completed.
- Backend still enforces seat capacity.
- Student can apply only while the program is Register Now.
- Student can remove an application only while registration is still open.
- If registration is closed, removal is blocked with a yellow warning message asking the student to contact Tadreeb support.
- Removing accepted applications no longer depends on status; the registration window controls removals.

## Student Home

- Search box now has an X button to clear the search and reset filters.
- Program cards now show:
  - Register closes on: date
  - Seats: available of total
- The registration close text is bold and black for better visibility.
- Program card button says Learn more and apply when registration is open.
- Program modal now supports scrolling when the content is tall.
- Program modal uses clearer closed-state messages.

## Student Applications

- My Applications page now separates completed programs into a new Completed Programs section.
- Completed Programs section appears only when the student has at least one completed program.
- Completed section uses the same table fields as My Applications.
- Completed program rows show Completed in the Action column instead of Remove.
- Application removal success shows a green toast.
- Registration-closed removal warning uses a yellow warning toast.
- Application status now moves automatically through Submitted, Under Review, and Not Reviewed based on the registration/program dates unless the company has already accepted or rejected it.
- If admin hides the company result, the student sees Under Review and an empty note.

## Company Request Form

- Company request form now shows a confirmation dialog before submitting.
- Company request form navbar now matches the public home navbar style.
- The request form navbar keeps Home, Login, and Contact Us links.
- The request form navbar can open and close on small screens using the menu button.

## Company And Admin Program Pages

- Company and admin program pages now use the same lifecycle display logic.
- Program ordering now places Register Now programs first, followed by Active, Selection Phase, and Completed.
- Program cards display registration close date.
- Company/admin completion remains manual.
- Program edit image fields now stay empty by default when the current image is only the default placeholder.
- Company program cards use the default program image when no image link is provided.
- Company program cards show Register closes and the date on one line.
- Company/admin cannot update student application status once a program is Active or Completed.

## Company Portal

- Company dashboard Application Snapshot now shows Student Name, University name, Program, and Status.
- Company dashboard avatars now use the student's first letter.
- Company participants table now shows Student Name, Student ID, University name, Program, Status, and Note.
- Company participant status badges use yellow, green, and red styles for Under Review, Accepted, and Rejected.
- Company profile removed Company ID and Internship Availability fields.
- Company profile now uses the same save behavior as student profile: header values update only after saving and Save Changes is disabled until edits exist.
- Company profile validation now matches company request rules where applicable.
- Company profile error messages appear below fields in red.
- Company profile password fields were shortened and polished.

## Admin Portal

- Admin dashboard Accepted stat was renamed to Active Internship Program.
- Admin dashboard Recent Applications now shows the latest five applications with student name and database ID.
- Admin dashboard Recent Users avatars now use first letters.
- Admin Programs shows Program by company inside the admin card only.
- Admin Participants now uses Student Name and Company Status wording.
- Participant visibility is shown by default; admin can hide it from the student.
- Admin participant modal removed Admin Status and keeps company note visibility controls.
- Admin Companies and Admin Users top stat cards were removed.
- Admin Companies now uses request-review labels: Under Review, Accepted, and Rejected.
- Admin Users page title changed to All Users.
- Admin Users shows system IDs using the last five characters of the database ID.
- Admin Users can activate/deactivate student and company login access; admin accounts remain Active.
- Admin add-user form validates role-specific fields and removed Additional Info for admin users.
- Admin profile now matches the company/student profile save behavior and validation rules.
- Admin profile removed the Admin ID field.

## Responsive And UI Polish

- Public home Companies tab underline now fills the tab width.
- Shared portal layout, modals, tables, and request form styles were hardened for small screens.
- Long modal content and long website links now wrap or scroll instead of overflowing.

## Backend

- Added `registrationDeadline` to the Opportunity model.
- Added validation for registration deadline on create/update.
- Student application apply/remove rules now use registration deadline.
- Application API now includes program status for student application grouping.
- Removed automatic status changes based only on seat capacity.
- Added automatic application status sync for Submitted, Under Review, and Not Reviewed.
- Application visibility defaults to shown for students.
- Backend masks hidden company results from students.
- Company status supports Pending, Active, Inactive, and Rejected for account access.
- Companies page review labels remain separate from login access status.
- Backend blocks company decision updates after a program becomes Active or Completed.
- Backend password fields are excluded by default from normal queries.

## Verification

- Frontend production build was run after changes.
- Backend syntax checks were run for touched backend files.
- Latest frontend production build compiles successfully.
- Previous ESLint warnings in `AdminCompanyDetailsModal.js` and `AdminParticipants.js` were cleared.
- Existing tooling warning remains from Node/react-scripts:
  - `DEP0176 fs.F_OK is deprecated`
