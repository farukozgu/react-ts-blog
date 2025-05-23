
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold">BlogMingle</h2>
            <p className="mt-4 text-sm text-gray-600">
              A modern platform for sharing thoughts, ideas, and stories.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Categories</h3>
            <ul className="mt-4 flex flex-wrap gap-4">
              <li>
                <Link to="/?category=technology" className="text-sm text-gray-600 hover:text-gray-900">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/?category=gaming" className="text-sm text-gray-600 hover:text-gray-900">
                  Gaming
                </Link>
              </li>
              <li>
                <Link to="/?category=music" className="text-sm text-gray-600 hover:text-gray-900">
                  Music
                </Link>
              </li>
              <li>
                <Link to="/?category=movies" className="text-sm text-gray-600 hover:text-gray-900">
                  Movies & TV
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} BlogMingle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
