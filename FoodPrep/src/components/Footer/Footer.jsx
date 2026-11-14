import React from 'react';
import { assets } from '../../assets/assets';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="foodprep-modern-footer" id="footer">
            <div className="footer-main-container">
                {/* Column 1: Brand & Personal App Description */}
                <div className="footer-col footer-col-brand">
                    <img className="footer-brand-logo" src={assets.logo_bottom} alt="FoodPrep" />
                    <p className="footer-app-description">
                        FoodPrep is a MERN-based full-stack application that enables users to manage recipes, organize meal plans, and track ingredients through a responsive and interactive web experience.
                    </p>
                    <div className="footer-social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
                            <img src={assets.facebook_icon} alt="Facebook" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Twitter">
                            <img src={assets.twitter_icon} alt="Twitter" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                            <img src={assets.linkedin_icon} alt="LinkedIn" />
                        </a>
                    </div>
                </div>

                {/* Column 2: Company Navigation Links */}
                <div className="footer-col">
                    <h3 className="footer-col-heading">Company</h3>
                    <ul className="footer-nav-list">
                        <li><a href="/">Home</a></li>
                        <li><a href="#footer">About Us</a></li>
                        <li><a href="#footer">Courses</a></li>
                        <li><a href="#footer">Reviews</a></li>
                    </ul>
                </div>

                {/* Column 3: Contact & Personal Details */}
                <div className="footer-col">
                    <h3 className="footer-col-heading">Get in touch</h3>
                    <ul className="footer-contact-list">
                        <li>
                            <span className="contact-icon">📞</span>
                            <a href="tel:+919177895782">+91 9177895782</a>
                        </li>
                        <li>
                            <span className="contact-icon">✉️</span>
                            <a href="mailto:muzammilshaik1525p@gmail.com">muzammilshaik1525p@gmail.com</a>
                        </li>
                    </ul>

                    <div className="developer-credit-tag">
                        <span>Crafted by <strong>Muzammil Shaik</strong></span>
                    </div>
                </div>
            </div>

            <div className="footer-divider-rule"></div>

            <div className="footer-bottom-bar">
                <p className="footer-copyright-text">
                    Copyright 2026 © FoodPrep. All rights reserved.
                </p>
                <div className="footer-security-tags">
                    <span>100% Secure Checkout</span>
                    <span>•</span>
                    <span>Fast Delivery</span>
                    <span>•</span>
                    <span>Customer First</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;