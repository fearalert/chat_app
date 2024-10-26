import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styles from './styles/Logout.module.css';
import axios from "axios";
import { logoutRoute } from "../api/apiRoutes";

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    const id = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY))._id;
    const response = await axios.get(`${logoutRoute}/${id}`);
    if (response.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      <BiPowerOff />
    </button>
  );
}
