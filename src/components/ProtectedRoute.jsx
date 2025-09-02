import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase-client";

const ProtectedRoute = ({ admin = false, children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      // Fetch profile (to check admin flag)
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (!profile) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      // Case 1: Protect admin-only route
      if (admin && profile.is_admin) {
        setAllowed(true);
      }
      // Case 2: Protect user-only route
      else if (!admin && !profile.is_admin) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }

      setLoading(false);
    };

    checkUser();
  }, [admin]);

  if (loading) return <div>Loading...</div>;

  if (!allowed) {
    return <Navigate to={`/signin?redirect=${location.pathname}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
