import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './HomeSlideshow.css'; // Add this import for custom styles

function HomeSlideshow() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(40,167,69,0.10)' }}>
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={4000}
        dynamicHeight={false}
      >
        <div>
          <img src="/slideshow/slide5.jpg" alt="World Hunger Day" />
        </div>
        <div>
          <img src="/slideshow/slide2.jpg" alt="Donation Box" />
        </div>
        <div>
          <img src="/slideshow/slide3.jpg" alt="Market Veggies" />
        </div>
      </Carousel>
    </div>
  );
}

export default HomeSlideshow; 