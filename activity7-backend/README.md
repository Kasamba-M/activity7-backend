# Study Support Requests API — ICT251 Activity 7

Backend for the same Study Support Requests system used in Activity 6.

## Technology

- Node.js and npm
- Express
- PostgreSQL using the `pg` package
- CORS and dotenv

## Important database note

The Activity 7 handout has an inconsistency: its tools section installs `pg`, and its sample SQL uses PostgreSQL-style `$1` parameters and `RETURNING`, while page 4 mentions SQLite. This implementation follows the explicit `pg` installation and SQL examples, so it requires a PostgreSQL database (for example, a Render PostgreSQL database). If your lecturer specifically requires SQLite, confirm before submission because the database driver and SQL need to be changed.

## Project structure

```text
activity7-backend/
├── routes/
│   └── records.js
├── .env.example
├── .gitignore
├── db.js
├── package.json
├── README.md
├── schema.sql
├── seed.sql
├── server.js
└── setup-db.js
```

## Run locally in VS Code (Windows)

1. Install an active Node.js LTS release.
2. Open this folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Install packages:

   ```powershell
   npm install
   ```

5. Create a PostgreSQL database named `study_support`.
6. Copy `.env.example` to `.env` and put your database connection string in `DATABASE_URL`.
7. Create the table and insert the nine Activity 6 sample records:

   ```powershell
   npm run db:setup
   ```

8. Start the API:

   ```powershell
   npm start
   ```

9. Open `http://localhost:3000` in a browser.

Do not upload `.env` or `node_modules` to GitHub.

## API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | API guide |
| GET | `/health` | Server/database health |
| GET | `/api/records` | List all records |
| GET | `/api/records/:id` | Get one record |
| POST | `/api/records` | Create a record |
| PUT | `/api/records/:id` | Replace all editable fields |
| DELETE | `/api/records/:id` | Delete a record |

## Record format

The database generates `id`. POST and PUT bodies must contain all four editable fields and must not include `id`.

```json
{
  "title": "Help with recursion in Java",
  "category": "Programming",
  "description": "I need help understanding recursive methods and base cases.",
  "status": "Pending"
}
```

Validation:
- `title`: string, 3–80 characters
- `category`: string, 2–40 characters
- `description`: string, 5–300 characters
- `status`: exactly `Pending`, `In progress`, or `Completed`
- IDs: positive whole numbers

## Postman test sequence

Use `http://localhost:3000` as the base URL.

1. `GET /health` — expect 200.
2. `GET /api/records` — expect 200 and an array containing the nine seed records.
3. `POST /api/records` — use the JSON example above; expect 201 and save its returned `id`.
4. `GET /api/records/ID` — replace `ID` with the returned ID; expect 200.
5. `PUT /api/records/ID` — send all four editable fields with one changed value; expect 200 and the same ID.
6. `DELETE /api/records/ID` — expect 200 and `{"message":"Record deleted."}`.
7. `GET /api/records/ID` — expect 404.
8. Send an invalid POST (for example, omit `title`) — expect 400.
9. Send a malformed JSON body — expect 400.
10. Try a valid positive ID that does not exist with GET, PUT and DELETE — each should return 404.
11. Restart the server and confirm that records remain in PostgreSQL.

## Deployment outline (Render)

1. Push this project to a GitHub repository. Include `package.json` and `package-lock.json`; exclude `.env` and `node_modules`.
2. Create a PostgreSQL database in Render and copy its **Internal Database URL** when configuring a Render web service in the same region (or use the External URL if required).
3. Create a Render Web Service connected to the repository.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `DATABASE_URL` = your Render PostgreSQL connection string
   - `NODE_ENV` = `production`
   - `CLIENT_ORIGINS` = your frontend origin if/when required (optional)
7. After deployment, run the database setup against the hosted database using the Render shell or a one-time local command with the hosted `DATABASE_URL`:

   ```powershell
   npm run db:setup
   ```

8. Test the hosted `/health`, `/api/records`, and all CRUD routes with Postman.

The live base URL is only available after you create and deploy the service. Do not submit a made-up URL.

## Before submission

- Replace the name and student-number placeholders in the API guide in `server.js`.
- Confirm with your lecturer whether PostgreSQL is acceptable given the SQLite wording inconsistency in the handout.
- Submit the real live backend base URL in the Activity 7 link field.
