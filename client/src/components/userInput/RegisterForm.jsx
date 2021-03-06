import React, {useContext} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../../contexts/User';
import {Button, Card, FormControl, InputLabel, MenuItem, Select, Stack,
  TextField} from '@mui/material';

/**
 * Returns a register form wrapped in custom card div.
 * @return {JSX.Element}
 * @constructor
 */
function RegisterForm() {
  const {
    register,
    formState: {errors},
    getValues,
    handleSubmit,
    control,
  } = useForm();

  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [userState, userDispatch] = useContext(UserContext);
  const onSubmit = async (data) => {
    fetch('/api/insert-user', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.ok) {
        userDispatch({type: 'login', username: data.username});
        navigate('../home');
      } else {
        console.log('Could not register user!'); // TODO
        const errorMessage = await (res.json());
        console.log(errorMessage);
        alert(errorMessage);
      }
    });
  };

  return (
    <Card elevation={5}>
      <form style={{padding: '2rem'}} onSubmit={handleSubmit(onSubmit)}>
        <h2>Register a new account</h2>

        <div>
          <TextField
            label="Username"
            inputProps={{'data-testid': 'username-input'}}
            type={'text'}
            required
            fullWidth
            margin="normal"
            error={errors.username}
            helperText={errors.username &&
                'A username can only include letters' +
                ' and cannot be longer than 40 characters.'}
            {...register('username',
                {required: true, maxLength: 40, pattern: /[A-Za-z]+$/i})}
          />
        </div>

        <div>
          <TextField
            label="Email"
            inputProps={{'data-testid': 'email-input'}}
            type={'email'}
            required
            fullWidth
            margin="normal"
            error={errors.email}
            helperText={errors.email && 'Email is required'}
            {...register('email',
                {required: true, maxLength: 40})}
          />
        </div>

        <div>
          <TextField
            label="Age"
            type={'number'}
            inputProps={{'data-testid': 'age-input'}}
            required
            fullWidth
            margin="normal"
            error={errors.age}
            helperText={errors.age &&
                'You need to be between 18 and 99 years old.'}
            {...register('age',
                {required: true, min: 18, max: 99})}
          />
        </div>

        <div>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Controller
              name='gender'
              inputProps={{'data-testid': 'gender-option'}}
              labelId="gender-label"
              label='Gender'
              defaultValue={'other'}
              control={control}
              render={({field}) => (
                <Select {...field}>
                  <MenuItem value={'female'}>Female</MenuItem>
                  <MenuItem value={'male'}>Male</MenuItem>
                  <MenuItem value={'other'}>Other</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </div>

        <div>
          <TextField
            label="Password"
            inputProps={{'data-testid': 'password-input'}}
            type={'password'}
            required
            fullWidth
            margin="normal"
            error={errors.password}
            helperText={errors.password && 'A password is required.'}
            {...register('password',
                {required: true, minLength: 6})}
          />
        </div>

        <div>
          <TextField
            label="Confirm password"
            inputProps={{'data-testid': 'password-confirmation-input'}}
            type={'password'}
            required
            fullWidth
            margin="normal"
            error={errors.passwordConfirmation}
            helperText={errors.passwordConfirmation &&
                'Passwords should match!'}
            {...register('passwordConfirmation', {
              required: true,
              validate: {
                matchesPreviousPassword: (value) => {
                  const {password} = getValues();
                  return password === value;
                },
              },
            })}
          />
        </div>

        <br />

        <Stack
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <p>Already have an account? <a href='/login'>Login</a></p>
          <Button
            variant="contained"
            type="submit"
          >
            Create account
          </Button>
        </Stack>
      </form>
    </Card>
  );
}

export default RegisterForm;
