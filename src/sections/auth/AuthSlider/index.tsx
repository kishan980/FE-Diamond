'use client';
import Slider from 'react-slick';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthSliderContainer, AuthSliderMainContainer } from './AuthSlider.styled';
import AuthSliderSkeleton from './AuthSliderSkeleton';
import AuthSliderComponent from './AuthSliderComponent';
import { HomePageServices } from 'services/homepage/homepage.services';
import { UpcomingEvents } from 'services/homepage/type';

const AuthBackground = () => {
  const settings = {
    dots: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [events, setEvents] = useState<UpcomingEvents[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      setEvents([]);
      const res = await HomePageServices.getUpcomingEvents();
      if (typeof res !== 'string' && res.success) setEvents(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in authBackground:', error);
      toast.error('An error occurred while fetching upcoming events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <AuthSliderMainContainer>
      <AuthSliderContainer>
        {!loading ? (
          <Slider {...settings} infinite={events.length > 1 ? true : false}>
            {events.map((event, index) => (
              <AuthSliderComponent key={index} event={event} />
            ))}
          </Slider>
        ) : (
          <AuthSliderSkeleton />
        )}
      </AuthSliderContainer>
    </AuthSliderMainContainer>
  );
};

export default AuthBackground;
