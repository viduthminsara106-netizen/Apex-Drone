'use client'

import { motion } from 'framer-motion'
import { Cpu, Zap } from 'lucide-react'
import styles from './Logo.module.css'

export default function DroneLogo() {
  return (
    <div className={styles.logoContainer}>
      <motion.div 
        className={styles.droneBody}
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={styles.propellers}>
          <motion.div 
             className={styles.prop} 
             animate={{ rotate: 360 }} 
             transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
             className={styles.prop} 
             animate={{ rotate: 360 }} 
             transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
             className={styles.prop} 
             animate={{ rotate: 360 }} 
             transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
             className={styles.prop} 
             animate={{ rotate: 360 }} 
             transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className={styles.core}>
          <Cpu size={40} className={styles.cpuIcon} />
          <motion.div 
            className={styles.glow}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        <Zap size={20} className={styles.zapIcon} />
      </motion.div>
      <h1 className={styles.title}>ApexDrone AI</h1>
    </div>
  )
}
