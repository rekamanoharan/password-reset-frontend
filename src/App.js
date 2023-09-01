import "./App.css";

// from React
import { useState, useContext, createContext, useEffect } from "react";
// For Routing
import { useHistory, Route, Switch, useParams } from "react-router-dom";
// For Styling
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
// For Validation
import { useFormik } from "formik";
// For popup Dialog box
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { forwardRef } from "react";

export default function App() {
  return (
    <div className="App">
      <Password />
    </div>
  );
}

const URL = "https://node-password-reset-flow.herokuapp.com/users";

// Local URL
// const URL='http://localhost:5000/users'

const context = createContext("");
function Password() {
  let history = useHistory();
  const obj = { history };
  return (
    <div className="container">
      <context.Provider value={obj}>
        <Switch>
          <Route exact path="/">
            <Signup />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/Dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/forgotpassword">
            <Forgotpassword />
          </Route>
          <Route path="/updatepassword">
            <Message />
          </Route>
          <Route path="/forgotpassword/verify/:id">
            <Redirect />
          </Route>
          <Route path="/newpassword/:id">
            <Newpassword />
          </Route>
          <Route path="/final">
            <Endpage />
          </Route>
          <Route path="**">NOT FOUND</Route>
        </Switch>
      </context.Provider>
    </div>
  );
}

function Signup() {
  // Routing
  const { history } = useContext(context);
  // For Message
  const [name, setName] = useState("");

  // Transition effects for the popup dialog box
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // Validation Condition
  let validation = (values) => {
    let error = {};
    if (values.Firstname === "") {
      error.Firstname = "Field Should not be empty";
    }
    if (values.Lastname === "") {
      error.Lastname = "Field Should not be empty";
    }
    if (values.Mailid === "") {
      error.Mailid = "Field Should not be empty";
    }
    if (values.Password === "") {
      error.Password = "Field Should not be empty";
    }
    return error;
  };
  // Formik validation
  const { handleChange, handleBlur, handleSubmit, errors, values, touched } =
    useFormik({
      initialValues: { Firstname: "", Lastname: "", Mailid: "", Password: "" },
      validate: validation,
      onSubmit: (userdata) =>
        signUp(userdata).then((x) => x === 200 && handleClickOpen()),
    });

  // Sending the sign up data to the Database
  const signUp = async (userdata) => {
    const signupresponse = await fetch(`${URL}/signup`, {
      method: "POST",
      body: JSON.stringify(userdata),
      headers: { "Content-Type": "application/json" },
    });

    return signupresponse.status;
    // When the status=200 the dialog box will automatically popup
  };

  // All the text field values are handled by Formik, On clicking the Get Started button all the input data will be sent to the database

  return (
    <Card variant="outlined" id="signup">
      <form className="signup" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="Firstname"
          name="Firstname"
          variant="standard"
          error={errors.Firstname && touched.Firstname}
          value={values.Firstname}
          helperText={errors.Firstname && touched.Firstname && errors.Firstname}
          type="text"
          onInput={handleChange}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          label="Firstname"
        />
        <br />

        <TextField
          fullWidth
          id="Lastname"
          name="Lastname"
          error={errors.Lastname && touched.Lastname}
          helperText={errors.Lastname && touched.Lastname && errors.Lastname}
          value={values.Lastname}
          variant="standard"
          type="text"
          onInput={handleChange}
          onBlur={handleBlur}
          label="Lastname"
        />
        <br />

        <TextField
          fullWidth
          id="Mailid"
          name="Mailid"
          error={errors.Mailid && touched.Mailid}
          value={values.Mailid}
          helperText={errors.Mailid && touched.Mailid && errors.Mailid}
          variant="standard"
          type="text"
          onInput={handleChange}
          onBlur={handleBlur}
          label="Mail ID"
        />
        <br />

        <TextField
          fullWidth
          id="Password"
          name="Password"
          error={errors.Password && touched.Password}
          value={values.Password}
          helperText={errors.Password && touched.Password && errors.Password}
          variant="standard"
          type="text"
          onInput={handleChange}
          onBlur={handleBlur}
          label="Password"
        />
        <br />
        <br />

        <Button fullWidth type="submit" variant="outlined">
          Get Started
        </Button>
        <br />

        <Dialog open={open} TransitionComponent={Transition} keepMounted>
          <DialogTitle>Welcome {name}!!!</DialogTitle>
          <DialogContent>
            <DialogContentText>Registration Completed</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => history.push("/login")}>Ok</Button>
          </DialogActions>
        </Dialog>
        <p style={{ textAlign: "center" }}>Or</p>
        <Button
          fullWidth
          type="submit"
          onClick={() => history.push("/login")}
          variant="contained"
          color="success"
        >
          Login
        </Button>
        <br />
        <label style={{ color: "red" }}>Already Have an account!!</label>
      </form>
    </Card>
  );
}

// User Login Page
function Login() {
  const { history } = useContext(context);

  let validation = (values) => {
    let error = {};
    if (values.Mailid === "") {
      error.Mailid = "Field Should not be empty";
    }
    if (values.Password === "") {
      error.Password = "Field Should not be empty";
    }
    return error;
  };

  const { handleChange, handleBlur, handleSubmit, errors, values, touched } =
    useFormik({
      initialValues: { Mailid: "", Password: "" },
      validate: validation,
      onSubmit: (userdata) =>
        logIn(userdata).then((x) => x === 200 && history.push("/dashboard")),
    });

  // On clicking the login button all the inputs are sent to the database & and those login credentials are checked in database
  // After the user is verified the page is automatically redirects to the Dashboard

  const logIn = async (userdata) => {
    const loginresponse = await fetch(`${URL}/login`, {
      method: "POST",
      body: JSON.stringify(userdata),
      headers: { "Content-Type": "application/json" },
    });
    return loginresponse.status;
  };

  return (
    <Card id="login" variant="outlined">
      <form onSubmit={handleSubmit}>
        <p style={{ fontWeight: 500, fontSize: "1.5rem" }}>
          W E L C O M E B A C K!!!
        </p>

        <TextField
          type="text"
          fullWidth
          id="Mailid"
          name="Mailid"
          variant="standard"
          error={errors.Mailid && touched.Mailid}
          value={values.Mailid}
          helperText={errors.Mailid && touched.Mailid && errors.Mailid}
          onInput={handleChange}
          onBlur={handleBlur}
          label="Mail ID"
        />
        <br />
        <br />

        <TextField
          type="text"
          fullWidth
          id="Password"
          name="Password"
          variant="standard"
          error={errors.Password && touched.Password}
          value={values.Password}
          helperText={errors.Password && touched.Password && errors.Password}
          onInput={handleChange}
          onBlur={handleBlur}
          label="Password"
        />
        <br />
        <br />

        <Button type="submit" fullWidth variant="contained" color="primary">
          Login
        </Button>
        <br />
        <br />

        <Button
          type="submit"
          style={{ marginLeft: "19.4rem" }}
          onClick={() => history.push("/forgotpassword")}
          variant="contained"
          color="error"
        >
          Forgot Password
        </Button>
      </form>
    </Card>
  );
}

// Forgot Password Page
function Forgotpassword() {
  const { history } = useContext(context);
  let validation = (values) => {
    let error = {};
    if (values.Mailid === "") {
      error.Mailid = "Field Should not be empty";
    }
    return error;
  };

  const { handleChange, handleBlur, handleSubmit, errors, values, touched } =
    useFormik({
      initialValues: { Mailid: "" },
      validate: validation,
      onSubmit: (userdata) =>
        forgot(userdata).then(
          (x) => x === 200 && history.push("/updatepassword")
        ),
    });
  // When the user enters the mailid it will be verified in the database,after the verification of the user the page is redirected
  // In the mean time a random string called token will overwrite the old password in the database  &
  // the Link to Change the password is sent to the registered mailid

  const forgot = async (userdata) => {
    const forgotresponse = await fetch(`${URL}/forgotpassword`, {
      method: "POST",
      body: JSON.stringify(userdata),
      headers: { "Content-Type": "application/json" },
    });
    return forgotresponse.status;
  };

  return (
    <Card id="forgotpage">
      <form onSubmit={handleSubmit}>
        <p style={{ fontWeight: 500, fontSize: "1.5rem" }}>
          F O R G O T P A S S W O R D
        </p>

        <TextField
          type="text"
          error={errors.Mailid && touched.Mailid}
          value={values.Mailid}
          helperText={errors.Mailid && touched.Mailid && errors.Mailid}
          onInput={handleChange}
          onBlur={handleBlur}
          fullWidth
          id="Mailid"
          name="Mailid"
          label="Mail ID"
          variant="standard"
        />
        <br />
        <br />

        <Button
          type="submit"
          fullWidth
          label="Password"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </Card>
  );
}

// Message Page will be displayed after the verification of user in the forgot page
function Message() {
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(handleClickOpen, []);
  return (
    <div>
      <Dialog open={open} TransitionComponent={Transition} keepMounted>
        <DialogTitle>M E S S A G E</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Mail Sent To The Registered Mailid
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// On clicking the link,it leads  to this Redirect Page which further leads to the Update password
function Redirect() {
  const { id } = useParams();
  // By using useParams Hook, the token from the database is taken

  return id ? <Updatepassword id={id} /> : null;
}

function Updatepassword({ id }) {
  const { history } = useContext(context);

  // The token which is named as id is used for verification, By having the token in the headers using GET method  the request is made
  // Once the token in the headers are verified it leads to the Newpassword page until that loading Page will be displayed
  const Result = (id) => {
    fetch(`${URL}/forgotpassword/verify`, {
      method: "GET",
      headers: { "x-auth-token": id },
    })
      .then((response) => response.status)
      .then((status) =>
        status === 200 ? history.push(`/newpassword/${id}`) : null
      );
  };

  Result(id);

  // Loading Page
  return (
    <div>
      <img
        style={{ marginLeft: "16rem" }}
        src="https://cdn.dribbble.com/users/108183/screenshots/2301400/spinnervlll.gif"
        alt="loading"
      ></img>
    </div>
  );
}

function Newpassword() {
  let { id } = useParams();
  // Still it will be using the same URL,by using useParams hook the token from the url is taken again
  const { history } = useContext(context);

  let validation = (values) => {
    let error = {};
    if (values.Password === "") {
      error.Password = "Field Should not be empty";
    }
    return error;
  };

  const { handleChange, handleBlur, handleSubmit, errors, values, touched } =
    useFormik({
      initialValues: { Password: "", token: id },
      validate: validation,
      onSubmit: (userdata) => Changepassword(userdata),
    });

  const Changepassword = (userdata) => {
    fetch(`${URL}/updatepassword`, {
      method: "POST",
      body: JSON.stringify(userdata),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.status)
      .then((status) => (status === 200 ? history.push("/final") : null));
  };
  //  On clicking the update password button the Using POST method the input & the token is sent to the database,
  //  then the password will be updated

  return (
    <Card id="changepassword">
      <form onSubmit={handleSubmit}>
        <p style={{ fontWeight: 500, fontSize: "1.5rem" }}>
          C H A N G E P A S S W O R D!!!
        </p>

        <TextField
          type="text"
          fullWidth
          label="Password"
          id="Password"
          name="Password"
          variant="standard"
          error={errors.Password && touched.Password}
          value={values.Password}
          helperText={errors.Password && touched.Password && errors.Password}
          onInput={handleChange}
          onBlur={handleBlur}
        />
        <br />
        <br />

        <Button type="submit" fullWidth variant="contained" color="success">
          Update Password
        </Button>
      </form>
    </Card>
  );
}

// After Password Change  a message dialog box which redirects to the Login Page
function Endpage() {
  const { history } = useContext(context);
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(handleClickOpen, []);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>M E S S A G E</DialogTitle>
        <DialogContent>
          <DialogContentText>Password Changed Successfully</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => history.push("/login")}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// UserDashboard
function Dashboard() {
  return <div>Welcome...</div>;
}
