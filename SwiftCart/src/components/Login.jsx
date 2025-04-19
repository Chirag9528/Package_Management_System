import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import userContext from '../Context/userContext';

const LoginPage = () => {
  const { type } = useParams(); // 'customer' or 'employee' or 'manager'
  const [formData, setFormData] = useState({email: '', password: ''});
  const [error,seterror] = useState('');
  const navigate = useNavigate();

  const {setcurrUser} = useContext(userContext);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e)  => {
    e.preventDefault();
    console.log(`Logging in as ${type}`, formData);

    if(!formData.email || !formData.password){
        console.log(error)
        return seterror("Email and Password should not be empty")
    }
    try {
        console.log(type)
        seterror('');
        if(type === 'customer') {
            setcurrUser(formData.email)
            const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/c/login`,{
                method: 'POST', 
                credentials: "include",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })
            .then(response => response.json())
            .catch(error => console.log(error))
        
            if (response && response.success){
                localStorage.setItem('username' , response.data.custInfo.first_name)
                console.log("successfully login")
                navigate('/customer/home')
            }
        }
        else if(type === 'employee'){
            setcurrUser('employee')
            const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/e/login`,{
                method: 'POST', 
                credentials: "include",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })
            .then(response => response.json())
            .catch(error => console.log(error))
        
            if (response && response.success){
                localStorage.setItem('username' , response.data.employeeInfo.first_name)
                console.log("successfully login")
                navigate('/employee/home')
            }
        }
        else if(type === 'manager'){
            setcurrUser('manager')
            const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/m/login`,{
                method: 'POST', 
                credentials: "include",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })
            .then(response => response.json())
            .catch(error => console.log(error))
        
            if (response && response.success){
                localStorage.setItem('username' , response.data.managerInfo.first_name)
                localStorage.setItem('id' , response.data.managerInfo.person_id)
                console.log("successfully login")
                console.log(response)
                navigate('/manager/home')
            }
        }
        
    } catch (err) {
        seterror('Failed to sign in. Please check your credentials.');
        console.error(err);
    } 
  };

  const isCustomer = type === 'customer';
  const title = isCustomer ? 'Customer' : 'Employee';

  return (
    
        
        <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your {title} account
                    </h1>
                    <form onSubmit={handleSubmit} class="space-y-4 md:space-y-6" action="#">
                        <div>
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email"
                                    name="email"
                                    id="email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" 
                                    required=""
                                />
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" 
                                    name="password" 
                                    id="password" 
                                    placeholder="••••••••" 
                                    value={formData.password}
                                    onChange={handleChange}
                                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    required=""
                                />
                                </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-start">
                                    <div class="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                                    </div>
                                    <div class="ml-3 text-sm">
                                        <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                            </div>
                            <button 
                                type="submit" 
                                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in
                            </button>
                            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don't have an account yet? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                            </p>
                        </form>
                </div>
            </div>
        </div>
        </section>
      
  );
};

export default LoginPage;
