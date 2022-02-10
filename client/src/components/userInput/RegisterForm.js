import Card from '../../ui/Card';
import classes from './LoginForm.module.css';


/**
 * Returns a login form wrapped in custom card div.
 * @return {JSX.Element}
 * @constructor
 */
function RegisterForm() {
  return <Card>
    <form className={classes.form}>

      <div className={classes.control}>
        <label htmlFor={'name'}>Your name</label>
        <input type={'text'} required id={'name'}/>
      </div>

      <div className={classes.control}>
        <label htmlFor={'Email'}>Email</label>
        <input type={'email'} required id={'Email'}/>
      </div>

      <div className={classes.control}>
        <label htmlFor={'password'}>Password</label>
        <input type={'password'} required id={'password'} placeholder={'6 characters'}/>
      </div>
      <div className={classes.actions}>
        <button>Create account</button>
      </div>

    </form>

  </Card>;
}


export default LoginForm;
