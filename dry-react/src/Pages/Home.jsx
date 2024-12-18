import React, { useEffect, useState } from 'react';
import './Home.css';
import config from '../../config.jsx';
import HomeGearCard from "./HomeGearCard.jsx";
import heroImage from '../assets/Hero_itt2.png';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import RehearsalRoomCard from "./Forms/RehearsalRoom/RehearsalRoomCard.jsx";

function Home() {
    const [musicGear, setMusicGear] = useState([]);
    const [rehearsalRooms, setRehearsalRooms] = useState([]);
    const [loadingMusicGear, setLoadingMusicGear] = useState(true);
    const [loadingRehearsalRooms, setLoadingRehearsalRooms] = useState(true);

    useEffect(() => {
        const fetchAllMusicGear = async () => {
            let allItems = [];
            let pageNumber = 1;
            let totalItems = 0;

            do {
                try {
                    const response = await fetch(`${config.apiBaseUrl}/api/MusicGear?pageNumber=${pageNumber}&pageSize=10`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    totalItems = data.totalItems;
                    allItems = allItems.concat(data.items);
                    pageNumber++;
                } catch (error) {
                    console.error('Error fetching music gear:', error);
                    break;
                }
            } while (allItems.length < totalItems);

            setMusicGear(allItems);
            setLoadingMusicGear(false);
        };

        const fetchAllRehearsalRooms = async () => {
            let allItems = [];
            let pageNumber = 1;
            let totalItems = 0;

            do {
                try {
                    const response = await fetch(`${config.apiBaseUrl}/api/RehearsalRooms?pageNumber=${pageNumber}&pageSize=10`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    totalItems = data.totalItems;
                    allItems = allItems.concat(data.items);
                    pageNumber++;
                } catch (error) {
                    console.error('Error fetching rehearsal rooms:', error);
                    break;
                }
            } while (allItems.length < totalItems);

            setRehearsalRooms(allItems);
            setLoadingRehearsalRooms(false);
        };

        fetchAllMusicGear();
        fetchAllRehearsalRooms();
    }, []);

    // Sort music gear by favoriteCount in descending order
    const sortedMusicGear = [...musicGear].sort((a, b) => b.favoriteCount - a.favoriteCount);

    return (
        <div className="home-container">
            <div className="hero-container" style={{backgroundImage: `url(${heroImage})`}}>
                <div className="hero-box">
                    <h1>Gør dit gear til guld</h1>
                    <Link to="/sell-gear" className="hero-button">Upload en artikel nu</Link>
                </div>
            </div>
            <h2>Populære artikler</h2>
            <div className="carousel-container">
                {loadingMusicGear ? (
                    Array(5).fill().map((_, index) => (
                        <Skeleton key={index} height={200} width={300} style={{margin: '10px'}}/>
                    ))
                ) : (
                    sortedMusicGear.map((item) => (
                        <HomeGearCard key={item.id} item={item}/>
                    ))
                )}
            </div>
            <h2>Senest tilføjede artikler</h2>
            <div className="carousel-container">
                {loadingMusicGear ? (
                    Array(5).fill().map((_, index) => (
                        <Skeleton key={index} height={200} width={300} style={{margin: '10px'}}/>
                    ))
                ) : (
                    musicGear.map((item) => (
                        <HomeGearCard key={item.id} item={item}/>
                    ))
                )}
            </div>
            <h2>Find dit nye øvelokale eller studie</h2>
            <div className="carousel-container">
                {loadingRehearsalRooms ? (
                    Array(5).fill().map((_, index) => (
                        <Skeleton key={index} height={200} width={300} style={{margin: '10px'}}/>
                    ))
                ) : (
                    rehearsalRooms.map((item) => (
                        <RehearsalRoomCard key={item.id} item={item}/>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;