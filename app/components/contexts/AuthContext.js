import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getUserData } from '../../src/api/user/route';
import { getSocket } from '../../socket/socketClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async userId => {
    try {
      const res = await getUserData(userId);
      if (res.success) {
        setUser(res.data); // Cập nhật user state với dữ liệu mới
      } else {
        setUser(null); // Nếu không lấy được dữ liệu, đặt user thành null
      }
    } catch (error) {
      console.error('Error fetching user public data:', error);
    }
  };

  const updateUserData = async (userData, email) => {
    getUser(userData.id);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Lỗi khi lấy session:', error);
      }
      const sessionUser = data?.session?.user;
      if (sessionUser) {
        await updateUserData(sessionUser, sessionUser.email);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await updateUserData(session.user, session.user.email);
        } else {
          setUser(null);
        }
      },
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (user?.id) {
      socket.emit('user-online', { userId: user.id });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
