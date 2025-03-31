const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./schoolClub.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Connected to the schoolClub database.');
});

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Clubs'", (err, row) => {
  if (err) {
    console.error(err.message);
    return;
  }
  if (!row) {
    db.serialize(() => {
      db.run(`CREATE TABLE Clubs (
        club_id INTEGER PRIMARY KEY,
        club_name TEXT,
        club_patron INTEGER,
        club_revenue_activity TEXT,
        club_revenue_date TEXT,
        club_revenue_amount REAL,
        FOREIGN KEY(club_patron) REFERENCES Patrons(patron_id)
      )`);

      db.run(`CREATE TABLE Patrons (
        patron_id INTEGER PRIMARY KEY,
        patron_name TEXT,
        patron_role TEXT
      )`);

      db.run(`CREATE TABLE Members (
        member_id INTEGER PRIMARY KEY,
        member_name TEXT,
        member_class TEXT,
        member_admission_number TEXT,
        member_club INTEGER,
        member_role TEXT,
        FOREIGN KEY(member_club) REFERENCES Clubs(club_id)
      )`);

      db.run(`CREATE TABLE Club_Activities (
        activity_id INTEGER PRIMARY KEY,
        club_id INTEGER,
        activity_name TEXT,
        activity_date TEXT,
        activity_description TEXT,
        FOREIGN KEY(club_id) REFERENCES Clubs(club_id)
      )`);

      db.run(`CREATE TABLE Club_Finances (
        finance_id INTEGER PRIMARY KEY,
        club_id INTEGER,
        finance_description TEXT,
        finance_amount REAL,
        finance_date TEXT,
        club_savings REAL,
        FOREIGN KEY(club_id) REFERENCES Clubs(club_id)
      )`);

      db.run(`CREATE TABLE Past_Members (
        past_member_id INTEGER PRIMARY KEY,
        member_name TEXT,
        member_class TEXT,
        member_admission_number TEXT,
        member_club INTEGER,
        member_role TEXT,
        academic_year TEXT,
        FOREIGN KEY(member_club) REFERENCES Clubs(club_id)
      )`);

      db.run(`CREATE TABLE New_Members (
        new_member_id INTEGER PRIMARY KEY,
        member_name TEXT,
        member_class TEXT,
        member_admission_number TEXT,
        member_club INTEGER,
        member_role TEXT,
        academic_year TEXT,
        FOREIGN KEY(member_club) REFERENCES Clubs(club_id)
      )`);

      db.run(`CREATE TABLE Admin (
        admin_id INTEGER PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255)
      )`);
    });
  }
});

// Create Allocations table if it doesn't exist
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Allocations'", (err, row) => {
  if (err) {
    console.error(err.message);
    return;
  }
  if (!row) {
    db.run(`CREATE TABLE Allocations (
      allocation_id INTEGER PRIMARY KEY,
      club_id INTEGER,
      support_activities REAL,
      annual_parties REAL,
      savings REAL,
      allocation_date TEXT,
      FOREIGN KEY(club_id) REFERENCES Clubs(club_id)
    )`);
  }
});

// Do not close the database connection
// module.exports = db;


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main static file
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to manage club details
app.post('/clubs', (req, res) => {
  const { club_name, club_patron, club_revenue_activity, club_revenue_date, club_revenue_amount } = req.body;
  db.run(`INSERT INTO Clubs (club_name, club_patron, club_revenue_activity, club_revenue_date, club_revenue_amount) VALUES (?, ?, ?, ?, ?)`,
    [club_name, club_patron, club_revenue_activity, club_revenue_date, club_revenue_amount],
    function(err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(201).send({ club_id: this.lastID });
    });
});

// Endpoint to get club details
app.get('/clubs', (_req, res) => {
  db.all(`SELECT * FROM Clubs`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to get a single club by ID
app.get('/clubs/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM Clubs WHERE club_id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Endpoint to update club details
app.put('/clubs/:id', (req, res) => {
  const { club_name, club_patron, club_revenue_activity, club_revenue_date, club_revenue_amount } = req.body;
  const { id } = req.params;
  db.run(`UPDATE Clubs SET club_name = ?, club_patron = ?, club_revenue_activity = ?, club_revenue_date = ?, club_revenue_amount = ? WHERE club_id = ?`,
    [club_name, club_patron, club_revenue_activity, club_revenue_date, club_revenue_amount, id],
    function(err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(200).send({ updated: this.changes });
    });
});

// Endpoint to delete a club
app.delete('/clubs/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Clubs WHERE club_id = ?`, id, function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send({ deleted: this.changes });
  });
});

// Endpoint to get club activities details
app.get('/activities', (_req, res) => {
  db.all(`SELECT * FROM Club_Activities`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to get a single activity by ID
app.get('/activities/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM Club_Activities WHERE activity_id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Endpoint to get club finances details
app.get('/finances', (_req, res) => {
  db.all(`SELECT * FROM Finances`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to get a single finance record by ID
app.get('/finances/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM Club_Finances WHERE finance_id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Endpoint to manage club activities
app.post('/activities', (req, res) => {
    const { activity_name, activity_date, club_id } = req.body;
    db.run(`INSERT INTO Club_Activities (activity_name, activity_date, club_id) VALUES (?, ?, ?)`,
        [activity_name, activity_date, club_id],
        function(err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.status(201).send({ activity_id: this.lastID });
        });
});

// Endpoint to delete an activity
app.delete('/activities/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Club_Activities WHERE activity_id = ?`, id, function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send({ deleted: this.changes });
  });
});

// Endpoint to manage club finances with allocation
app.post('/finances', (req, res) => {
    const { finance_description, finance_amount, finance_date, club_id } = req.body;
    const support_activities = finance_amount * 0.50;
    const annual_parties = finance_amount * 0.30;
    const savings = finance_amount * 0.20;

    db.run(`INSERT INTO Club_Finances (finance_description, finance_amount, finance_date, club_id, club_savings) VALUES (?, ?, ?, ?, ?)`,
        [finance_description, finance_amount, finance_date, club_id, savings],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message }); // Ensure error response is JSON
            }
            // Insert allocations into a new table for tracking purposes
            db.run(`INSERT INTO Allocations (club_id, support_activities, annual_parties, savings, allocation_date) VALUES (?, ?, ?, ?, ?)`,
                [club_id, support_activities, annual_parties, savings, finance_date],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(201).json({ finance_id: this.lastID });
                });
        });
});

// Endpoint to delete a finance record
app.delete('/finances/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Club_Finances WHERE finance_id = ?`, id, function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send({ deleted: this.changes });
  });
});

// Endpoint to get allocation details
app.get('/allocations', (_req, res) => {
  db.all(`SELECT * FROM Allocations`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to manage student membership
app.post('/members', (req, res) => {
  const { member_name, member_class, member_admission_number, member_club, member_role } = req.body;
  db.run(`INSERT INTO Members (member_name, member_class, member_admission_number, member_club, member_role) VALUES (?, ?, ?, ?, ?)`,
    [member_name, member_class, member_admission_number, member_club, member_role],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message }); // Ensure error response is JSON
      }
      res.status(201).json({ member_id: this.lastID });
    });
});

// Endpoint to get a single member by ID
app.get('/members/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM Members WHERE member_id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Endpoint to delete a member
app.delete('/members/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Members WHERE member_id = ?`, id, function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send({ deleted: this.changes });
  });
});

// Endpoint to manage patrons
app.post('/patrons', (req, res) => {
  const { patron_name, patron_role } = req.body;
  db.run(`INSERT INTO Patrons (patron_name, patron_role) VALUES (?, ?)`,
    [patron_name, patron_role],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message }); // Ensure error response is JSON
      }
      res.status(201).json({ patron_id: this.lastID });
    });
});

// Endpoint to get a single patron by ID
app.get('/patrons/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM Patrons WHERE patron_id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Endpoint to delete a patron
app.delete('/patrons/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Patrons WHERE patron_id = ?`, id, function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send({ deleted: this.changes });
  });
});

// Endpoint to manage past members
app.post('/past-members', (req, res) => {
  const { member_name, member_class, member_admission_number, member_club, member_role, academic_year } = req.body;
  db.run(`INSERT INTO Past_Members (member_name, member_class, member_admission_number, member_club, member_role, academic_year) VALUES (?, ?, ?, ?, ?, ?)`,
    [member_name, member_class, member_admission_number, member_club, member_role, academic_year],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ past_member_id: this.lastID });
    });
});

// Endpoint to get a single past member by ID
app.get('/past-members/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM Past_Members WHERE past_member_id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Endpoint to delete a past member
app.delete('/past-members/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Past_Members WHERE past_member_id = ?`, id, function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send({ deleted: this.changes });
  });
});

// Endpoint to manage new members
app.post('/new-members', (req, res) => {
  const { member_name, member_class, member_admission_number, member_club, member_role, academic_year } = req.body;
  db.run(`INSERT INTO New_Members (member_name, member_class, member_admission_number, member_club, member_role, academic_year) VALUES (?, ?, ?, ?, ?, ?)`,
    [member_name, member_class, member_admission_number, member_club, member_role, academic_year],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ new_member_id: this.lastID });
    });
});

// Endpoint to get a single new member by ID
app.get('/new-members/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM New_Members WHERE new_member_id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Endpoint to delete a new member
app.delete('/new-members/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM New_Members WHERE new_member_id = ?`, id, function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send({ deleted: this.changes });
  });
});

// Endpoint to get past members details
app.get('/past-members', (_req, res) => {
  db.all(`SELECT * FROM Past_Members`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to get new members details
app.get('/new-members', (_req, res) => {
  db.all(`SELECT * FROM New_Members`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/:table', (req, res) => {
  const table = req.params.table;
  db.all(`SELECT * FROM ${table}`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to compute total financial contributions to club activities
app.get('/total-contributions', (_req, res) => {
  db.get(`SELECT SUM(finance_amount) as total_contributions FROM Club_Finances`, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ total_contributions: row.total_contributions });
  });
});

app.get('/club-savings', (_req, res) => {
  db.all(`
    SELECT c.club_name, 
           IFNULL(SUM(f.finance_amount), 0) - IFNULL(SUM(f.club_savings), 0) AS savings
    FROM Clubs c
    LEFT JOIN Club_Finances f ON c.club_id = f.club_id
    GROUP BY c.club_id
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/financial-summary', (_req, res) => {
  db.all(`
    SELECT c.club_name, 
           IFNULL(SUM(f.finance_amount), 0) AS total_income,
           IFNULL(SUM(f.club_savings), 0) AS total_savings,
           (IFNULL(SUM(f.finance_amount), 0) - IFNULL(SUM(f.club_savings), 0)) AS net_balance
    FROM Clubs c
    LEFT JOIN Club_Finances f ON c.club_id = f.club_id
    GROUP BY c.club_id
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/activity-report', (_req, res) => {
  db.all(`
    SELECT a.activity_name, a.activity_date, a.activity_description, c.club_name
    FROM Club_Activities a
    JOIN Clubs c ON a.club_id = c.club_id
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// app.get('/reports', (_req, res) => {
//   db.all(`SELECT * FROM Reports`, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(rows);
//   });
// });

// Endpoint to get patrons details
app.get('/patrons', (_req, res) => {
  db.all(`SELECT * FROM Patrons`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to get members details
app.get('/members', (_req, res) => {
  db.all(`SELECT * FROM Members`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to get club activities details
app.get('/club_activities', (_req, res) => {
  db.all(`SELECT * FROM Club_Activities`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to get club finances details
app.get('/club_finances', (_req, res) => {
  db.all(`SELECT * FROM Club_Finances`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to get past members details
app.get('/past_members', (_req, res) => {
  db.all(`SELECT * FROM Past_Members`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to get new members details
app.get('/new_members', (_req, res) => {
  db.all(`SELECT * FROM New_Members`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint to get reports details
app.get('/reports', (_req, res) => {
  db.all(`SELECT * FROM Reports`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
