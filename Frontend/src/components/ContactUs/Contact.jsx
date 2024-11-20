import { useState, useRef } from "react"
import { motion } from "framer-motion"
import emailjs from '@emailjs/browser'

import { styles } from "../../styles"
import { slideIn } from "../../utils/motion"
import { EarthCanvas } from "../canvas"
import styles1 from './ContactUs.module.css';

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false);

  const handleChange =(e) => {
    const {name, value} = e.target;

    setForm({...form, [name]:value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs.send('service_yg0pg8r', 'template_kiufyoh',
      {
        from_name: form.name,
        to_name: 'Maxim',
        from_email: form.email,
        to_email: 'maxroenco2004@gmail.com',
        message: form.message,
      },
      'wENYR-vuKMTOamg4i'
    )
    .then(() => {
      setLoading(false);
      alert('Thank you, I will get back to you as soon as possible.');
      setForm({name: '', email: '', message: ''});
    }, (error) => {
      setLoading(false);
      console.log(error);
      alert('Something went wrong');
    })
  }

  return (
    <div className="pt-6">
      <div className={styles1.container}>
          <h1 className={styles1.heading}>Who We Serve?</h1>
            <div className={styles1.contactGrid}>
                <div className={styles1.contactItem}>
                    <h2 className={styles1.contactTitle}>Individuals and families</h2>
                    <p>Providing choice for those investing for retirement, a new home or a child’s education.</p>

                </div>
                <div className={styles1.contactItem}>
                    <h2 className={styles1.contactTitle}>Financial advisors</h2>
                    <p>Helping people at all income levels invest for their futures.</p>

                </div>
                <div className={styles1.contactItem}>
                    <h2 className={styles1.contactTitle}>Educational and nonprofit organizations</h2>
                    <p>Working to educate more students and solve social challenges</p>
                </div>
                <div className={styles1.contactItem}>
                    <h2 className={styles1.contactTitle}>Pension plans</h2>
                    <p>Managing the retirement savings of teachers, doctors, workers, and small business owners.</p>
                </div>
                <div className={styles1.contactItem}>
                    <h2 className={styles1.contactTitle}>Insurance companies</h2>
                    <p>Supporting people during life’s most difficult moments.</p>
                </div>
                <div className={styles1.contactItem}>
                    <h2 className={styles1.contactTitle}>Governments</h2>
                    <p>Financing new hospitals, schools, roads and other projects helping to drive economic growth.</p>
                </div>
            </div>

            <div className={styles1.whoWeAreContainer}>
                <h1 className={styles1.heading}>Who We Are?</h1>
                <div className={styles1.whoWeAreGrid}>
                    <div className={styles1.whoWeAreItem}>
                        <img src="yellow-group.png" alt="people" className={styles1.whoWeAreImage} />
                        <p className={styles1.whoWeAreTitle}>19,000+ people </p>

                        <p className={styles1.whoWeAreText}> of different backgrounds, races, and nationalities.</p>
                    </div>
                    <div className={styles1.whoWeAreItem}>
                        <img src="languages.png" alt="Multilingual Support" className={styles1.whoWeAreImage} />
                        <p className={styles1.whoWeAreTitle}>135 languages</p>
                        <p className={styles1.whoWeAreText}>addressing the needs of a multilingual client base.</p>
                    </div>
                    <div className={styles1.whoWeAreItem}>
                        <img src="countries.webp" alt="countries" className={styles1.whoWeAreImage} />
                        <p className={styles1.whoWeAreTitle}>42 countries</p>
                        <p className={styles1.whoWeAreText}>enabling us to help more and more people.</p>
                    </div>
                </div>
            </div>
            </div>
      <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden ">
        <motion.div 
          variants={slideIn('left', 'tween', 0.5, 1)}
          className="flex-[0.75] bg-[#1c1c1c] p-8 rounded-2xl"
        >
          <p className= {`${styles.sectionSubText} text-white`} >
          Get in touch
          </p>
          <h3 className={`${styles.sectionHeadText}`}>
            Contact.
          </h3>

          <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8" >
            <label htmlFor="" className="flex flex-col">
              <span className="text-whtie font-medium mb-4">Your Name</span>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="What's your name?" className="bg-[#2b2b2b] py-4 px-6 placeholder:text-white text-white rounded-lg outlined-none border-none font-medium" />
            </label>

            <label className="flex flex-col">
              <span className="text-whtie font-medium mb-4">Your Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="What's your email?" className="bg-[#2b2b2b] py-4 px-6 placeholder:text-white text-white rounded-lg outlined-none border-none font-medium" />
            </label>

            <label  className="flex flex-col">
              <span className="text-whtie font-medium mb-4">Your Message</span>
              <textarea rows="7" name="message" value={form.message} onChange={handleChange} placeholder="What do you want to say?" className="bg-[#2b2b2b] py-4 px-6 placeholder:text-white text-white rounded-lg outlined-none border-none font-medium" />
            </label>
            <button type="subbmit" className="bg-[#2b2b2b] py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

        </motion.div>

        <motion.div
                  variants={slideIn('right', 'tween', 0.2, 1)}
                  className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
        >
          <EarthCanvas/>
        </motion.div>
      </div>
          <div className={styles1.contactInfoContainer}>
          <div className={styles1.contactInfo}>
              <h2 className={styles1.contactHeading}>Call Us:</h2>
              <p className={styles1.contactDetail}>+373 76 786 740</p>
          </div>
          <div className={styles1.addressInfo}>
              <h2 className={styles1.contactHeading}>Here’s Our Address:</h2>
              <p className={styles1.addressDetail}>Forum Office Mt. Varlaam 63/23 str. Chisinau </p>
          </div>
          <div className={styles1.emailInfo}>
              <h2 className={styles1.contactHeading}>Send Us E-mail:</h2>
              <p className={styles1.emailDetail}>investora@money.com</p>
          </div>
      </div>
    </div>
  )
}

export default Contact;