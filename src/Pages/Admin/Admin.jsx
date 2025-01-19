/* eslint-disable no-unused-vars */
import React from 'react';
import BookingList from './BookingList';
import BreakingNewsList from './BreakingNewsList';
import VideoLinkList from './VideoLinkList';
import CardList from './CardList';


const Admin = () => {
    return (
        <div>
          <BookingList></BookingList>
          <BreakingNewsList></BreakingNewsList>
          <VideoLinkList></VideoLinkList>
          <CardList></CardList>
        </div>
    );
};

export default Admin;