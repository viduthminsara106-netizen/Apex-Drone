'use client'

import styles from './About.module.css'
import { ShieldCheck, Zap, TrendingUp, DollarSign, Target } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section className={styles.hero}>
        <div className={styles.heroLogo}>ApexDrone AI</div>
        <p className={styles.introText}>
          ApexDrone AI යනු කෘත්රිම බුද්ධිය (Artificial Intelligence), ඩ්රෝන තාක්ෂණය (Drone Technology) සහ Cloud Mining යන ක්ෂේත්රවල නවීනතම ප්රවණතාවලින් උපරිම ප්රයෝජන ලබා ගනිමින් සකස් කළ ලොව ප්රමුඛතම ආයෝජන වේදිකාවකි. අපගේ පද්ධතිය මගින් සාම්ප්රදායික ආයෝජන ක්රමවලින් බැහැරව, තාක්ෂණික දියුණුව මත පදනම් වූ ස්ථාවර සහ ඉහළ මූල්ය ප්රතිලාභ ලබා දීමට කටයුතු කරයි.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>අප කරන්නේ කුමක්ද?</h2>
        <div className={styles.grid}>
          <motion.div className={styles.card} variants={itemVariants}>
            <div className={styles.iconBox}><Zap size={24} /></div>
            <h3>AI Mining Technology</h3>
            <p>නවීනතම AI ඇල්ගොරිතම භාවිතයෙන් ක්රියාත්මක වන අපගේ Mining පද්ධතිය හරහා ඉතාමත් කාර්යක්ෂමව සහ අවම පිරිවැයකින් ඩිජිටල් වත්කම් (Assets) උත්පාදනය කරනු ලබයි.</p>
          </motion.div>
          
          <motion.div className={styles.card} variants={itemVariants}>
            <div className={styles.iconBox}><ShieldCheck size={24} /></div>
            <h3>Drone Technology Investments</h3>
            <p>කර්මාන්ත ශාලා නිරීක්ෂණය, පතල් කැණීම් (Mining Operations) සහ ආරක්ෂක ක්ෂේත්රය සඳහා භාවිතා කරන උසස් ඩ්රෝන තාක්ෂණික ව්යාපෘති සඳහා ආයෝජනය කරමින් ඉහළ ලාභාංශ ලබා ගනී.</p>
          </motion.div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ඇයි ApexDrone AI තෝරාගත යුත්තේ?</h2>
        <div className={styles.featureList}>
          <motion.div className={styles.featureItem} variants={itemVariants}>
            <TrendingUp size={28} className={styles.featIcon} />
            <div>
              <h4>ස්වයංක්රීය ආයෝජන පද්ධතිය</h4>
              <p>අපගේ AI තාක්ෂණය මගින් ඔබේ ආයෝජනය 24/7 කළමනාකරණය කරන බැවින් ඔබට කිසිදු වෙහෙසකින් තොරව ලාභය ලබා ගත හැක.</p>
            </div>
          </motion.div>

          <motion.div className={styles.featureItem} variants={itemVariants}>
            <ShieldCheck size={28} className={styles.featIcon} />
            <div>
              <h4>විනිවිදභාවය සහ ආරක්ෂාව</h4>
              <p>නවීනතම දත්ත ආරක්ෂණ ක්රමවේද (Encryption) මගින් ඔබේ ගනුදෙනු සහ පෞද්ගලිකත්වය උපරිමයෙන් ආරක්ෂා කරයි.</p>
            </div>
          </motion.div>

          <motion.div className={styles.featureItem} variants={itemVariants}>
            <DollarSign size={28} className={styles.featIcon} />
            <div>
              <h4>ඉහළ ප්රතිලාභ</h4>
              <p>ඩ්රෝන සහ AI යන නැගී එන ක්ෂේත්රවල ලාභය සෘජුවම අපගේ ආයෝජකයින් අතර බෙදා දෙනු ලබයි.</p>
            </div>
          </motion.div>

          <motion.div className={styles.featureItem} variants={itemVariants}>
            <Zap size={28} className={styles.featIcon} />
            <div>
              <h4>ක්ෂණික ගෙවීම්</h4>
              <p>ඉතා පහසුවෙන් සහ කඩිනමින් ඔබ උපයන ලාභය ලබා ගැනීමේ (Withdrawal) පහසුකම් සලසා ඇත.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.mission}>
        <motion.div className={styles.missionCard} variants={itemVariants}>
          <Target size={40} className={styles.missionIcon} />
          <h2>අපගේ මෙහෙවර (Our Mission)</h2>
          <p>තාක්ෂණය ගැන ගැඹුරු දැනුමක් නොමැති ඕනෑම අයෙකුට වුවද, නවීන ලෝකයේ බලවත්ම තාක්ෂණයන් වන AI සහ Drones හරහා මූල්යමය වශයෙන් ස්ථාවර වීමට ආරක්ෂිත සහ පහසු මාවතක් సකසා දීම අපගේ එකම අරමුණයි.</p>
        </motion.div>
      </section>
    </motion.div>
  )
}
