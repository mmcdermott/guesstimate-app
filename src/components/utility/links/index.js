import React, {Component} from 'react'
import IubendaPrivacyPolicy from 'gComponents/lib/iubenda_privacy_policy.js'

export const LinkFAQ = () => (
  <a href='/faq'> FAQ </a>
)

export const LinkBlog = () => (
  <a href='https://medium.com/guesstimate-blog'> Blog </a>
)

export const LinkTerms = () => (
  <a href='/terms'> Terms of Service </a>
)

export const LinkPrivacy = () => (
  <IubendaPrivacyPolicy id={7790420}>
    Privacy Policy
  </IubendaPrivacyPolicy>
)

export const LinkGithubStar = () => (
  <iframe src="https://ghbtns.com/github-btn.html?user=getguesstimate&repo=guesstimate-app&type=star&count=true" frameBorder="0" scrolling="0" width="160px" height="30px"></iframe>
)

export const LinkTwitterFollow = () => (
  <a className="twitter-follow-button"
      href="https://twitter.com/getguesstimate"
      dataSize="small">
    Follow @getguesstimate</a>
)

