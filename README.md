# Soynikon Desk

A full-stack business management web app built for a real business, handling clients, orders, and shipping label generation. Built as a real working tool and as a portfolio project.

**Live demo:** [desk.soynikon.do](https://desk.soynikon.do)

## Demo access

This deployment is a personal project, not the production tool used by the business it was built for. Public self-registration is intentionally disabled to avoid spam accounts — use one of the seeded demo accounts on the sign-in page instead.

| Role     | Username | Password             |
| -------- | -------- | -------------------- |
| Admin    | admin    | cegge0-ruhBep-nofmaw |
| Standard | standard | defmyK-dyqhaj-2bywta |

## Stack

**Frontend**

- React + Vite
- React Router
- Bootstrap (layout utilities only)
- Sonner (toast notifications)
- FontAwesome
- `@react-pdf/renderer` (shipping label PDF generation)

**Backend**

- OWN PHP APIs + MySQL
- JWT auth via `firebase/php-jwt`
- Environment config via `vlucas/phpdotenv`

**Hosting**

- Hostinger shared hosting (`desk.soynikon.do`)

## Features

- Role-based access control (`admin` / `standard`)
- Client management (create, edit, delete, search/filter)
- Orders history with SQL joins across clients, orders, items, cities, and states
- Shipping label generation as downloadable PDFs
- JWT-based authentication with protected routes

## License

Personal project — not currently licensed for reuse.
