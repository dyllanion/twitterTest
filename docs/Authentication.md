# Authentication

## Registration

To register, a user provides an email, username, and password. Naturally, both
the email and username must be unique. There are also no restrictions on what
characters can be used for the password or a required length.

> Passwords are encrypted using bcrypt, which is salt based.

## Login

To login, a user provides their email and password (not username). If the login
information is correct the user is redirected to their dashboard, otherwise they
return to the login page.

## Logout

To logout, click the logout button located in the sidebar.
