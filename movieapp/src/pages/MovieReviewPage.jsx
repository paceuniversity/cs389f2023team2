import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import MovieQueue from '../util/MovieQueue';
import './moviereviewpage.css'
import StarIcon from '@mui/icons-material/Star';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { alpha, styled } from '@mui/material/styles';
import { FiArrowRight } from "react-icons/fi";
import { app } from "../FirebaseConfig";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";

/**
 * MovieReviewPage component:
 * This component handles the movie review page. It handles the displaying all the reviews
 * on an person's profile.
 */

function MovieReviewPage() {
    // Pride
    let user = window.location.href.split('/')[4];
    const [json, setJSON] = useState({});
    const [reviews, setReviews] = useState([]);
    const [updated, setUpdated] = useState(false);

    // Get members JSON. We need to get their reviews which is stored in this JSON.
    useEffect(() => {
        const getJSON = async () => {
            const querySnapshot = await getDocs(collection(getFirestore(app), "members"));
            querySnapshot.forEach((doc) => {
                if (doc.data().test === undefined) {
                    setJSON(doc.data());
                }
            });
        }
        getJSON();
    }, {});

    // Set the reviews. We also want to set the path to the movie page so that we can link to it.
    if (!updated) {
        if (json !== null) {
            const reviewList = [];

            if (json[user] !== undefined) {
                for (let i = 0; i < json[user].reviews.length; i++) {
                    const review = json[user].reviews[i];

                    if (review !== undefined) {
                        reviewList.push(
                            <Link className="review-link" to={`/review/${review.reviewId}`}>
                                <div className="review">
                                    <img className="movie-posters" src={review.poster}></img>
                                    <div className="review-information">
                                        <h2>{`${review.title} (${review.year})`}</h2>
                                        <div className="review-date">
                                            <h5>{review.date}</h5>
                                        </div>
                                        <div className="review-rating">
                                            <Rating size ='medium' precision={0.5} value={review.rating} readOnly/>
                                        </div>
                                        <div className="review-description">
                                            <p>{review.review}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>)
                    }
                }
                setUpdated(true);
                setReviews(reviewList);
            }
        }
    }

    // Render the reviews page.
    return (
        <div className="review-page-container">
            <div className="reviews-section">
                <div className="title"><h1>Reviews</h1></div>
                <ol>{reviews}</ol>


                </div>
        </div>
    );
}
export default MovieReviewPage;