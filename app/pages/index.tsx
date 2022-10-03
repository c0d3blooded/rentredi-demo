import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import type { NextPage } from "next";
import Head from "next/head";
import { useForm, Controller } from "react-hook-form";
import { ref } from "firebase/database";
import { useListVals } from "react-firebase-hooks/database";
import { User } from "../models/user";
import { database } from "../services/firebase";
import { addUser, deleteUser, updateUser } from "../services/api";
import { useState } from "react";
import { Delete, Edit } from "@mui/icons-material";

import uniqBy from "lodash.uniqby";

interface FormInputs {
  name: string;
  zip_code: string;
}

const Home: NextPage = () => {
  const [users, loading, error] = useListVals<User>(ref(database, "users"));
  const [isSavingUser, setIsSavingUser] = useState(false); // the user is being added
  const [editingId, setEditingId] = useState<string | undefined>(); // ids currently being edited
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<FormInputs>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  if (loading) {
    return <Box m={4}>Loading...</Box>;
  }
  if (error) {
    return <Box m={4}>Could not fetch data: {error.message}</Box>;
  }

  /** Add a user */
  const onAddUser = async () => {
    try {
      const { name, zip_code } = getValues();
      setIsSavingUser(true);
      await addUser(name, zip_code);
      setIsSavingUser(false);
    } catch (e) {
      console.error(e);
    }
  };

  /** Update a user */
  const onUpdateUser = async () => {
    const { name, zip_code } = getValues();
    if (editingId)
      try {
        setIsSavingUser(true);
        await updateUser(editingId, name, zip_code);
        setIsSavingUser(false);
      } catch (e) {
        console.error(e);
      }
  };

  /** Delete a user */
  const onDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
    } catch (e) {
      console.error(e);
    }
  };

  /** The user inputs for adding a new user */
  const renderUserInputs = () => {
    return (
      <form
        onSubmit={
          !editingId ? handleSubmit(onAddUser) : handleSubmit(onUpdateUser)
        }
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems={"start"}
          justifyContent="start"
        >
          <Box display="flex" mb={3}>
            {/* name input */}
            <Controller
              name="name"
              control={control}
              defaultValue=""
              // validations
              rules={{
                required: "Please enter a name",
              }}
              render={({ field }) => (
                <TextField
                  label="Name"
                  focused
                  {...field}
                  // field validation errors
                  error={Boolean(errors.name?.message)}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Box pr={2} />
            {/* zip code input */}
            <Controller
              name="zip_code"
              control={control}
              defaultValue=""
              // validations
              rules={{
                required: "Please enter a zip code",
                validate: {
                  zip_code: (v) =>
                    !/^\d{5}(?:[-\s]\d{4})?$/.test(v)
                      ? "Please enter a valid zip code"
                      : undefined,
                },
              }}
              render={({ field }) => (
                <TextField
                  label="Zip Code"
                  focused
                  inputMode="numeric"
                  {...field}
                  // field validation errors
                  error={Boolean(errors.zip_code?.message)}
                  helperText={errors.zip_code?.message}
                />
              )}
            />
          </Box>
          <Box display="flex" flexDirection="row">
            <LoadingButton
              variant="contained"
              type="submit"
              loading={isSavingUser}
            >
              {editingId ? "Update User" : "Add User"}
            </LoadingButton>
            {/* show cancel button when editing */}
            {editingId && (
              <>
                <Box ml={2} />
                <Button
                  variant="contained"
                  disabled={isSavingUser}
                  color="error"
                  onClick={() => {
                    // clear the add/edit user form
                    setEditingId(undefined);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>
      </form>
    );
  };

  /** The user row for the table */
  const renderUserRow = (user: User) => {
    /** Default row actions */
    const _renderRowActions = (
      <Box display="flex" flex={1} flexDirection="row" justifyContent="end">
        <IconButton
          color="primary"
          aria-label="Edit"
          component="label"
          onClick={() => {
            // set in edit mode
            setEditingId(user.id);
            setValue("name", user.name);
            setValue("zip_code", user.zip_code);
          }}
        >
          <Edit />
        </IconButton>
        <Box mr={2} />
        <IconButton
          color="primary"
          aria-label="Edit"
          component="label"
          onClick={() => onDeleteUser(user.id)}
        >
          <Delete />
        </IconButton>
      </Box>
    );

    return (
      <TableRow
        key={user.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {user.id}
        </TableCell>
        <TableCell component="th" scope="row">
          {user.name}
        </TableCell>
        <TableCell align="right">{user.zip_code}</TableCell>
        <TableCell align="right">{user.latitude}</TableCell>
        <TableCell align="right">{user.longitude}</TableCell>
        <TableCell align="right">{user.timezone}</TableCell>
        <TableCell align="right">{_renderRowActions}</TableCell>
      </TableRow>
    );
  };

  /** The user table to be displayed. Renders placeholder if no users available */
  const renderUserTable = () => {
    return users && users.length > 0 ? (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* header */}
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Zip Code</TableCell>
              <TableCell align="right">Latitude</TableCell>
              <TableCell align="right">Longitude</TableCell>
              <TableCell align="right">Timezone</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          {/* table rows */}
          <TableBody>
            {uniqBy(users, "id").map((user: User) => renderUserRow(user))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography variant="subtitle1" component="h2">
        No Users Found
      </Typography>
    );
  };

  return (
    <Box m={3}>
      <Head>
        <title>RentRedi Demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* add/edit user */}
        <div>
          <Box component="h2" mb={2}>
            {editingId ? "Edit User" : "Add User"}
          </Box>
          {/* add/edit user inputs */}
          {renderUserInputs()}
        </div>
        {/* users */}
        <Box component="h2" mb={2}>
          Users
        </Box>
        {/* user table */}
        {renderUserTable()}
      </main>
    </Box>
  );
};

export default Home;
