import { useState } from "react";
import Hashids from "hashids";
import {
  Button,
  Checkbox,
  Frame,
  GroupBox,
  TextInput,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import supabase from "../db";

type Props = {
  target: {
    value: string;
  };
};

const hashids = new Hashids("gerbilspace");

// From https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
const urlPattern =
  /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/; // eslint-disable-line no-useless-escape

const NewUrl = ({ session }: any) => {
  const [longUrl, setLongUrl] = useState("");
  const [preferredSlug, setPreferredSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortlist, setShortlist] = useState(false);
  const [error, setError] = useState("");

  const onLongUrlChange = ({ target: { value } }: Props) => {
    setError("");
    setLongUrl(value);
  };

  const onPreferredSlugChange = ({ target: { value } }: Props) => {
    setPreferredSlug(value);
  };

  const onShortlistChange = () => setShortlist(!shortlist);

  const onCreateShortLinkSubmit = async (e: any) => {
    e.preventDefault();

    if (longUrl.trim().length === 0) {
      setError("Please enter a link to shorten");
      return;
    }

    if (!longUrl.trim().match(urlPattern)) {
      setError("Your link is not valid");
      return;
    }

    let slug = preferredSlug;
    if (!slug) slug = hashids.encode(Date.now());

    const { data } = await supabase
      .from("urls")
      .select()
      .eq("slug", slug)
      .maybeSingle();

    if (data) {
      setError("That slug is taken, please choose another");
    }

    const { data: createdData } = await supabase
      .from("urls")
      .insert({
        slug,
        url: longUrl,
        user_id: session?.user.id,
        shortlist
      })
      .select()
      .single();

    setShortUrl(`https://gerbil.space/${createdData.slug}`);
  };

  return (
    <Window style={{ top: "20px", left: "5vw", width: "90vw" }}>
      <WindowHeader>
        linkShortener.exe
        <Button style={{ right: "10px", top: "10px", position: "absolute" }}>
          <div className="close-icon" />
        </Button>
      </WindowHeader>

      <WindowContent>
        {shortUrl.length === 0 && (
          <GroupBox label="Create short link">
            <form onSubmit={onCreateShortLinkSubmit}>
              {error.length > 0 && <Frame variant="status">{error}</Frame>}
              <div>
                <label htmlFor="longUrl">Link to shorten *</label>
                <TextInput
                  id="longUrl"
                  value={longUrl}
                  onChange={onLongUrlChange}
                />
              </div>

              <div>
                <label htmlFor="slug">Slug</label>
                <TextInput
                  id="slug"
                  value={preferredSlug}
                  onChange={onPreferredSlugChange}
                />
              </div>

              <Checkbox
                checked={!!shortlist}
                onChange={onShortlistChange}
                value="shortlist"
                label="Shortlist"
                name="shortlist"
              />

              <div>
                <Button type="submit">Create Short Link</Button>
              </div>
            </form>
          </GroupBox>
        )}

        {shortUrl.length > 0 && (
          <GroupBox label="Short Link">
            Your short link is <a href={shortUrl}>{shortUrl}</a>, and it's ready
            to go.
          </GroupBox>
        )}
      </WindowContent>
    </Window>
  );
};

export default NewUrl;
