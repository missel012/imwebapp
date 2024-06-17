import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const { data: userData, error: fetchError } = await supabase
        .from('user')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError || !userData || !(await bcrypt.compare(password, userData.user_password))) {
        throw new Error('Invalid credentials');
      }

      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const logout = async (callback) => {
    try {
      console.log('Performing logout actions...');
      setUser(null);
      localStorage.removeItem('user');
      console.log('Logout successful');
      callback(); // Execute callback function for redirection or any other actions
    } catch (error) {
      console.error('Error logging out:', error.message);
      throw new Error('Failed to logout'); // Ensure proper error handling
    }
  };
  

  const updateProfile = async (updatedUserData) => {
    try {
      const { error: updateError } = await supabase
        .from('user')
        .update({
          email: updatedUserData.email,
          user_password: await bcrypt.hash(updatedUserData.user_password, 10),
        })
        .eq('userid', updatedUserData.userid);

      if (updateError) {
        throw updateError;
      }

      setUser(updatedUserData);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
