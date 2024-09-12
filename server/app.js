/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const oracledb = require("oracledb");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const jwtSecret = "your_jwt_secret";

app.use(bodyParser.json());
app.use(cors());

// OracleDB connection configuration
const dbConfig = {
  user: "tunisair",
  password: "10052000",
  connectString: "localhost:1521/XE",
};

let oracleClientInitialized = false;

async function initializeDBConnection() {
  try {
    if (!oracleClientInitialized) {
      oracledb.initOracleClient({
        libDir:
          "C:\\Users\\MSI\\Downloads\\instantclient-basic-windows.x64-23.4.0.24.05\\instantclient_23_4",
      });
      oracleClientInitialized = true;
    }

    await oracledb.createPool(dbConfig);
    console.log("Connected to OracleDB");
    return true;
  } catch (err) {
    console.error("Error connecting to OracleDB", err);
    return false;
  }
}

// Endpoint to search for data based on a search term
app.get("/api/search", async (req, res) => {
  let connection;

  try {
    const searchTerm = req.query.searchTerm;

    // Get a connection to the Oracle DB
    connection = await oracledb.getConnection();

    // Construct the SQL query dynamically to search across multiple columns
    const query = `
      SELECT * FROM DOCUMENT 
      WHERE 
        EVENTNUMBER LIKE '%${searchTerm}%' OR
        EVENTVERSION LIKE '%${searchTerm}%' OR
        EVENTTYPE LIKE '%${searchTerm}%' OR
        EVENT LIKE '%${searchTerm}%' OR
        ENTITYSTATUS LIKE '%${searchTerm}%' OR
        EVENTTYPESHORTCODE LIKE '%${searchTerm}%' OR
        JOURNALDATE LIKE '%${searchTerm}%' OR
        WITHUPDATEDACCOUNTEDDATE LIKE '%${searchTerm}%' OR
        CREATEDBY LIKE '%${searchTerm}%' OR
        OFFICEIDEVENT LIKE '%${searchTerm}%' OR
        USECASETYPE LIKE '%${searchTerm}%' OR
        INTERNALID LIKE '%${searchTerm}%' OR
        PRIMARYDOCUMENTNBR LIKE '%${searchTerm}%' OR
        TYPE_DOC LIKE '%${searchTerm}%' OR
        DOCUMENTOPERATIONALSTATUS LIKE '%${searchTerm}%' OR
        ISSUEINDICATOR LIKE '%${searchTerm}%' OR
        TRANSACTIONCODE LIKE '%${searchTerm}%' OR
        TRANSACTIONTYPE LIKE '%${searchTerm}%' OR
        NUMBEROFCONJUNCTIVETICKETS LIKE '%${searchTerm}%' OR
        REASONFORISSUANCECODE LIKE '%${searchTerm}%' OR
        EMDREMARK LIKE '%${searchTerm}%' OR
        FULLROUTING LIKE '%${searchTerm}%' OR
        VALIDATINGCARRIER LIKE '%${searchTerm}%' OR
        REASONFORISSUANCEDESCRIPTION LIKE '%${searchTerm}%' OR
        DATEOFISSUANCE LIKE '%${searchTerm}%' OR
        VALIDATINGAIRLINEALLIANCECODE LIKE '%${searchTerm}%' OR
        ORIGINALISSUEINFOFREEFLOW LIKE '%${searchTerm}%' OR
        CODE LIKE '%${searchTerm}%' OR
        ACQUISITIONTYPE LIKE '%${searchTerm}%' OR
        INVOLUNTARYINDICATOR LIKE '%${searchTerm}%' OR
        ISLAFAPPLIEDINDICATOR LIKE '%${searchTerm}%' OR
        ISREDEMPTIONTICKET LIKE '%${searchTerm}%' OR
        ISREDEMPTIONWITHFARETICKET LIKE '%${searchTerm}%' OR
        ISSCHEDULECHANGE LIKE '%${searchTerm}%' OR
        AGENCYNAME LIKE '%${searchTerm}%' OR
        AGENCYGROUPNAME LIKE '%${searchTerm}%'
    `;

    // Execute the constructed SQL query
    const result = await connection.execute(query);

    // Send the search results as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error("Error searching data:", error);
    res.status(500).json({ error: "Error searching data" });
  } finally {
    // Release the Oracle DB connection
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
});

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(
      `INSERT INTO USERS (username, password) VALUES (:username, :password)`,
      { username, password: hashedPassword }
    );
    await connection.commit();

    // Generate token
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Error registering user");
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT password FROM USERS WHERE username = :username`,
      { username }
    );

    const user = result.rows[0];
    if (user && user[0]) {
      const hashedPasswordFromDB = user[0];

      const match = await bcrypt.compare(password, hashedPasswordFromDB);

      if (match) {
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
        res.status(200).json({ token });
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Error logging in");
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// Admin Login
const ADMIN_USERNAME = "TunisairAdmin";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("12345678", 10);

app.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === ADMIN_USERNAME) {
      const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

      if (isMatch) {
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
        res.status(200).json({ token });
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).send("Server error");
  }
});

// Example protected route
app.get("/admindashboard", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Authorization header missing");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    res.status(200).send("Welcome to the admin dashboard!");
  });
});

initializeDBConnection().then((connected) => {
  if (connected) {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } else {
    console.error("Database connection failed. Server cannot start.");
  }
});

// admin dashboard
// Endpoint to get all users
app.get("/api/users", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute("SELECT * FROM USERS");

    const users = result.rows.map((row) => ({
      username: row[0],
      password: row[1],
    }));

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// Endpoint to add a new user
app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  let connection;
  try {
    connection = await oracledb.getConnection(); // Fixed the issue here
    await connection.execute(
      `INSERT INTO USERS (username, password) VALUES (:username, :password)`,
      { username, password: hashedPassword }
    );
    await connection.commit();

    res.status(201).send("User created successfully");
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).send("Error adding user");
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// Endpoint to update a user
app.put("/api/users/:username", async (req, res) => {
  const { username } = req.params;
  const { newUsername, password } = req.body;
  console.log("Request body:", req.body);
  console.log("Request params:", req.params);

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  let connection;
  try {
    connection = await oracledb.getConnection();

    // Fetch the original user data to ensure we're updating the correct record
    const originalUserQuery = `SELECT username FROM USERS WHERE username = :username`;
    const { rows } = await connection.execute(originalUserQuery, { username });

    if (rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const originalUsername = rows[0].USERNAME;

    // Check if the new username is already taken (if it's being changed)
    if (newUsername && originalUsername !== newUsername) {
      const { rows: existingUserRows } = await connection.execute(
        `SELECT COUNT(*) AS count FROM USERS WHERE username = :newUsername`,
        { newUsername }
      );

      console.log(
        `Checking new username existence: ${existingUserRows[0].COUNT} found`
      );

      if (existingUserRows[0].COUNT > 0) {
        return res.status(400).send("New username already exists");
      }

      // Update the username and password
      const result = await connection.execute(
        `UPDATE USERS SET username = :newUsername, password = :password WHERE username = :originalUsername`,
        {
          newUsername, // New username
          password: hashedPassword, // Hashed password
          originalUsername, // Original username fetched from the database
        },
        { autoCommit: false } // Explicitly specify autoCommit
      );

      console.log(`Update result: ${result.rowsAffected} rows affected`);
    } else {
      // Only update the password
      const result = await connection.execute(
        `UPDATE USERS SET password = :password WHERE username = :originalUsername`,
        {
          password: hashedPassword, // Hashed password
          originalUsername, // Original username fetched from the database
        },
        { autoCommit: false } // Explicitly specify autoCommit
      );

      console.log(`Update result: ${result.rowsAffected} rows affected`);
    }

    // Commit the transaction
    await connection.commit();
    console.log("Transaction committed successfully");

    res.status(200).send("User updated successfully");
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Error updating user");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
});

// Delete User Route
app.delete("/api/users/:username", async (req, res) => {
  const { username } = req.params;
  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `DELETE FROM USERS WHERE username = :username`,
      { username }
    );
    await connection.commit();

    if (result.rowsAffected && result.rowsAffected > 0) {
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Error deleting user");
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});
