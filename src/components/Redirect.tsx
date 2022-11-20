import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Window, WindowContent, WindowHeader } from "react95";
import supabase from "../db";

const Redirect = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { pathname } = useLocation();
  const slug = pathname.replaceAll("/", "");
  const getUrl = useCallback(async () => {
    const { data } = await supabase
      .from("urls")
      .select()
      .eq("slug", slug)
      .maybeSingle();

    if (!data) {
      setLoading(false);
      setError(true);
      return "";
    }

    return data.url;
  }, [slug]);

  useEffect(() => {
    getUrl().then((url) => {
      setLoading(false);
      document.location.href = url;
    });
  }, [getUrl]);

  return (
    <Window>
      <WindowHeader>redirector.exe</WindowHeader>
      <WindowContent>
        {loading && <div>Loading...</div>}
        {error && (
          <div>
            Your link could not be found. <Link to="/">Try again?</Link>
          </div>
        )}
        {!loading && !error && <div>Going now...</div>}
      </WindowContent>
    </Window>
  );
};

export default Redirect;
