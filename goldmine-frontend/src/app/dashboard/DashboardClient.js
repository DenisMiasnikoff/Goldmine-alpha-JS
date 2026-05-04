"use client"
import { useState } from "react";
import styles from "../_components/_Dashboard/Dashboard.module.scss";
import Header from "../_components/Header/Header";
import Sidebar from '../_components/Sidebar/Sidebar';
import MainContent from '../_components/MainContent/MainContent';

export default function DashboardClient({ posts, dungeonId, token }) {
  const [isSideBarVisible, setIsSideBarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSideBarVisible(!isSideBarVisible);
  };

  return (
    <div className={styles.container}>
      <Header onLogoClick={toggleSidebar} />
      
      <div className={styles.content}>
        <Sidebar isVisible={isSideBarVisible} />
        
        {/* Pass the data down to your MainContent where the forms and feed live */}
        <MainContent 
          posts={posts} 
          dungeonId={dungeonId} 
          token={token} 
        />
      </div>
    </div>
  );
}