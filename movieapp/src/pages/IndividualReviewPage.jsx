import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import MovieQueue from '../util/MovieQueue';
import './individualreviewpage.css'
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

function IndividualReviewPage() {
    const href = window.location.href;

    const [json, setJSON] = useState({});
    const [review, setReview] = useState({});
    const [updated, setUpdated] = useState(false);
    const [path, setPath] = useState('');

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

    if (json !== null && !updated) {
        Object.keys(json).forEach((key) => {
            for (let i = 0; i < json[key].reviews.length; i++) {
                const review = json[key].reviews[i];

                if (review.reviewId === href.split('/')[4]) {
                    setPath('/movie/' + review.title.replaceAll(' ', '-').toLowerCase() + '-' + review.year);
                    setReview(review);
                    setUpdated(true);
                }
            }
        });
    }

    console.log(path);

    return (
        <div className="moviereviewcontainer">
                <div className="reviewsection">
                <div className="review">
                    <Link to={path}><img className="review-movie-posters" src={review.poster}></img></Link>
                    <div className="review-informationss">
                        <h2>{`${review.title} (${review.year})`}</h2>
                        <div className="the-review-date">
                            <h5>{review.date}</h5>
                        </div>
                        <div className="the-review-rating">
                            <Rating size ='medium' precision={0.5} value={review.rating === undefined ? 0 : review.rating} readOnly/>
                        </div>
                        <div className="review-description">
                            <p>{review.review}</p>
                        </div>
                    </div>
                </div>
        </div>

        </div>
        
    )
}

export default IndividualReviewPage;