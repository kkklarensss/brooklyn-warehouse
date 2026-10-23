import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Coffee,
  MapPin,
  Sparkles,
  Users,
  Wifi,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { menuService } from '../services/menuService'

export function HomePage() {
  return (
    <>
      <section className="home-hero container">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow">
            <span className="small-line" />
            YOUR NEIGHBORHOOD PAUSE, IN MANILA
          </div>
          <h1>
            A good day
            <br />
            starts with
            <br />
            <em>a little brew.</em>
          </h1>
          <p>
            Your favorite cup. A corner to call your own.
            <br className="desktop-break" /> Come for the coffee, stay for the moments.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="button button-primary">
              Find your next cup
              <ArrowUpRight size={18} />
            </Link>
            <Link to="/reservations" className="text-link">
              Find your space
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-location">
            <MapPin size={16} />
            <span>Sampaloc, Manila</span>
            <span className="location-divider" />
            <span>Made for slow sips & good company</span>
          </div>
        </div>
        <div className="hero-photo">
          <img
            src="/images/coffee-ritual.jpg"
            alt="A barista slowly pouring hot water over freshly ground coffee"
            fetchPriority="high"
            width="1600"
            height="1067"
          />
          <span className="photo-label">
            <span className="white-dot" />
            THE EVERYDAY RITUAL
          </span>
          <div className="hero-stamp">
            <Coffee size={31} strokeWidth={1.2} />
            <span>
              BREW. MEET.
              <br />
              REPEAT.
            </span>
          </div>
          <div className="photo-caption">
            <span>
              Nothing rushed.
              <br />
              <em>Just really good coffee.</em>
            </span>
            <ArrowDown size={25} strokeWidth={1.3} />
          </div>
        </div>
      </section>
      <div className="ritual-strip">
        <div className="container">
          <span>
            <Coffee size={18} />
            Coffee worth slowing down for
          </span>
          <span>
            <Users size={18} />A little room for everyone
          </span>
          <span>
            <Wifi size={18} />
            Stay a while, stay connected
          </span>
          <span>
            <Sparkles size={18} />
            Your everyday, a little better
          </span>
        </div>
      </div>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE USUALS, FOR A REASON</span>
            <h2>
              Meet your next <em>favorite.</em>
            </h2>
          </div>
          <Link to="/menu" className="text-link">
            See the full menu
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="product-grid featured-grid">
          {[menuService.getAll()[0], menuService.getAll()[2], menuService.getAll()[3]].map(
            (product) => (
              <ProductCard key={product.id} product={product} />
            ),
          )}
        </div>
        <p className="catalog-note">
          A taste of what's to come. Sample menu and prices for this preview.
        </p>
      </section>
      <section className="space-section container">
        <div className="space-art" aria-hidden="true">
          <div className="window-frame">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="sun-disc" />
          <div className="table-top" />
          <div className="table-leg" />
          <div className="plant">
            <i />
            <i />
            <i />
            <span />
          </div>
          <div className="little-cup" />
          <span className="space-art-label">
            A LITTLE SPACE.
            <br />A LOT OF POSSIBILITIES.
          </span>
        </div>
        <div className="space-copy">
          <span className="eyebrow">MORE THAN A COFFEE STOP</span>
          <h2>
            Make room for
            <br />
            <em>your kind of moment.</em>
          </h2>
          <p>
            Catch up with your people, get a little work done, or gather for something special.
            There's a space for the way you spend your day.
          </p>
          <Link to="/reservations" className="button button-outline">
            Explore our spaces
            <ArrowUpRight size={18} />
          </Link>
          <div className="space-features">
            <span>VIP room</span>
            <span>Small gatherings</span>
            <span>Shared moments</span>
          </div>
        </div>
      </section>
      <section className="visit-section container">
        <span className="eyebrow">SAME CITY. YOUR NEW CORNER.</span>
        <h2>
          See you <em>at Brooklyn.</em>
        </h2>
        <p>2F YOU.suites, 2113 Recto Avenue, Sampaloc, Manila</p>
        <Link className="text-link" to="/help">
          Plan your visit
          <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  )
}
