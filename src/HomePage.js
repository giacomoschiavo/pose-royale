import React from "react";
import styles from "./HomePage.module.css";
import firstCardImg from "./img/firstCardPose.png";
import secondCardImg from "./img/secondCardPose.png";
import thirdCardImg from "./img/thirdCardPose.png";
import firstTeamMember from "./img/firstTeamMember.png";
import secondTeamMember from "./img/secondTeamMember.png";
import thirdTeamMember from "./img/thirdTeamMember.png";

const HomePage = () => {
  return (
    <div>
        <div className={`${styles.playContainer}`}>
            <div className={`${styles.linkContainer}`}>
                <p className={`${styles.linkText}`}>How to play</p>
                <p className={`${styles.linkText}`}>About</p>
            </div>

            <div className={`${styles.buttonContainer}`}>
                <div className={`${styles.buttonDiv}`}>
                    <button className={`${styles.playButton}`}>Play!</button>
                </div>
            </div>
        </div>

        <div className={`${styles.homeSectionContainer}`}>
            <p className={`${styles.titleText}`}>How To Play?</p>
            <p className={`${styles.subtitleText}`}>So you didn’t skip the tutorial, huh?</p>

            <div className={`${styles.cardsContainer}`}>
                <div className={`${styles.card}`}>
                    <img src={firstCardImg} className={`${styles.cardImg}`} alt="Card Image"/>
                    <div className={`${styles.cardContent}`}>
                        <p className={`${styles.cardText}`}>Pose in front of the webcam!</p>
                    </div>
                </div>

                <div className={`${styles.card}`}>
                    <img src={secondCardImg} className={`${styles.cardImg}`} alt="Card Image"/>
                    <div className={`${styles.cardContent}`}>
                        <p className={`${styles.cardText}`}>Pay attention to the timer!</p>
                    </div>
                </div>

                <div className={`${styles.card}`}>
                    <img src={thirdCardImg} className={`${styles.cardImg}`} alt="Card Image"/>
                    <div className={`${styles.cardContent}`}>
                        <p className={`${styles.cardText}`}>Complete all the 3 levels (if you dare)</p>
                    </div>
                </div>
            </div>
        </div>

        <div className={`${styles.homeSectionContainer}`}>
            <p className={`${styles.titleText}`}>The Team</p>
            <p className={`${styles.subtitleText}`}>Curious person, aren’t you?</p>

            <div className={`${styles.cardsContainer}`}>
                <div className={`${styles.teamMemberContainer}`}>
                    <img src={firstTeamMember} className={`${styles.teamImg}`} alt="Card Image"/>
                    <p className={`${styles.subtitleText}`}>Filippo Venturini</p>
                    <p className={`${styles.subtitleText}`}>Role</p>
                </div>
                <div className={`${styles.teamMemberContainer}`}>
                    <img src={secondTeamMember} className={`${styles.teamImg}`} alt="Card Image"/>
                    <p className={`${styles.subtitleText}`}>Giacomo Schiavo</p>
                    <p className={`${styles.subtitleText}`}>Role</p>
                </div>
                <div className={`${styles.teamMemberContainer}`}>
                    <img src={thirdTeamMember} className={`${styles.teamImg}`} alt="Card Image"/>
                    <p className={`${styles.subtitleText}`}>Giacomo Sanguin</p>
                    <p className={`${styles.subtitleText}`}>Role</p>
                </div>
            </div>
        </div>

    </div>
  );
};

export default HomePage;
