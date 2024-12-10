import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Import useParams and useLocation
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Card from "@/components/Card";
import { FileType } from "@/types";
import { getFileTypesParams } from "@/lib/utils";

const Pages = () => {
  const { type } = useParams(); // Get the media type from the route parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [files, setFiles] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchText = searchParams.get("query") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const types = getFileTypesParams(type) as FileType[];
        const result = await getFiles({ types, searchText, sort });
        setFiles(result.documents);
      } catch (err) {
        setError("Failed to fetch files");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [type, searchText, sort]); // Re-fetch files when the media type, search text, or sort changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">0 MB</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">
              Sort by:
            </p>
            <Sort /> {/* Moved Sort component outside of the <p> */}
          </div>
        </div>
      </section>

      {/* Render the files */}
      {files.length > 0 ? (
        <section className="file-list">
          {files.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default Pages;
