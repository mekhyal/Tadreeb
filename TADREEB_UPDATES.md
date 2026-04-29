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

## Company And Admin Program Pages

- Company and admin program pages now use the same lifecycle display logic.
- Program ordering now places Register Now programs first, followed by Active, Selection Phase, and Completed.
- Program cards display registration close date.
- Company/admin completion remains manual.

## Backend

- Added `registrationDeadline` to the Opportunity model.
- Added validation for registration deadline on create/update.
- Student application apply/remove rules now use registration deadline.
- Application API now includes program status for student application grouping.
- Removed automatic status changes based only on seat capacity.

## Verification

- Frontend production build was run after changes.
- Backend syntax checks were run for touched backend files.
- Existing unrelated build warnings remain:
  - `AdminCompanyDetailsModal.js`: missing `useEffect` dependency warning.
  - `AdminParticipants.js`: unused `isSaving` warning.
