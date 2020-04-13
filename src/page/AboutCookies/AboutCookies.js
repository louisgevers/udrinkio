import React, { Component } from 'react'
import './AboutCookies.css'
import Logo from '../../component/Cover/Logo/Logo'

class AboutCookies extends Component {
    render = () => {
        return (
            <div className='AboutCookies'>
                <div className='cookies-header'>
                    <Logo />
                </div>
                <div className='cookies-explanation'>
                    <h1>About cookies</h1>
                    <p>When you are using <a href='udrink.io'>udrink.io</a>, some information can be stored on your computer, tablet, or smartphone under the form of cookies. This page explains what these cookies are, how they work, and which cookies you can expect when using this website.<br/>
                    Note that cookies are optional on <a href='udrink.io'>udrink.io</a>, but enabling them makes further development easier.</p>
                    <h2>What is a cookie?</h2>
                    <p>A cookie is a small text file containing a limited amount of information, which is then stored on your device when you visit a website. Developers use them to improve user experience, for statistical analysis, or targetted advertising.<br/>
                    These cookies can only be read by the transmitter, and allows the same transmitter to recognize each time your device accesses content from the transmitter.<br/>
                    Every cookie has an expiry date, after which the cookie will become invalid and deleted.</p>
                    <h2>Which cookies are used for udrink.io?</h2>
                    <h3>Cookies used for analytics</h3>
                    <p>
                        These cookies are used to measure website traffic and the way the audience uses <a href='udrink.io'>udrink.io</a>. Our team uses a tool called Google Analytics, which enables us to know:
                    </p>
                    <ul>
                        <li>The number of people using the website</li>
                        <li>What drinking games are most popular amongst users</li>
                        <li>How long people spend on certain games</li>
                        <li>What time of the day are most users using the site</li>
                        <li>Etc...</li>
                    </ul>
                    <p>
                        This information is all strictly anonymous and allows us to better understand your preferences and improve the website accordingly. It allows us to improve popular games, rethink unpopular ones, plan proper times for updates, etc.<br/>
                    </p>
                    <table>
                        <thead>
                            <tr>
                                <th>Cookie Name</th>
                                <th>Expiry Date</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>_ga</td>
                                <td>2 years</td>
                                <td>Used to distinguish users</td>
                            </tr>
                            <tr>
                                <td>_gid</td>
                                <td>24 hours</td>
                                <td>Used to distinguish users</td>
                            </tr>
                            <tr>
                                <td>_gat</td>
                                <td>1 minute</td>
                                <td>Used to reduce the amount of requests</td>
                            </tr>
                            <tr>
                                <td>accepted-cookies</td>
                                <td>30 days</td>
                                <td>Used to avoid asking for cookies again when accepted</td>
                            </tr>
                        </tbody>
                        </table>
                    <h2>I do not wish to have cookies on my device</h2>
                    <p><a href='udrink.io'>udrink.io</a> can be used without cookies by not accepting cookies when prompted. If you wish to further oppose the use of cookies you can take further measures.</p>
                    <ul>
                        <li>Chrome: <a href='https://support.google.com/accounts/answer/61416'>https://support.google.com/accounts/answer/61416</a></li>
                        <li>Firefox: <a href='https://support.mozilla.org/en-US/kb/block-websites-storing-cookies-site-data-firefox'>https://support.mozilla.org/en-US/kb/block-websites-storing-cookies-site-data-firefox</a></li>
                        <li>Edge: <a href='https://support.microsoft.com/en-us/help/4468242/microsoft-edge-browsing-data-and-privacy'>https://support.microsoft.com/en-us/help/4468242/microsoft-edge-browsing-data-and-privacy</a></li>
                        <li>Safari: <a href='https://support.apple.com/en-in/guide/safari/sfri11471/mac'>https://support.apple.com/en-in/guide/safari/sfri11471/mac</a></li>
                        <li>Opera: <a href='https://help.opera.com/en/latest/web-preferences/#cookies'>https://help.opera.com/en/latest/web-preferences/#cookies</a></li>
                    </ul>
                    <h3>Disabling cookies on your browser</h3>
                    <p>If you wish you can disable cookies on your computer or mobile device through your browser settings. Note that this might change your user experience on many different websites.</p>
                    <h3>Disable specific cookies</h3>
                    <p>You can disable specific cookies from third parties <a href='udrink.io'>udrink.io</a> uses:</p>
                    <ul>
                        <li>Google analytics: <a href='https://tools.google.com/dlpage/gaoptout'>https://tools.google.com/dlpage/gaoptout</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default AboutCookies