import { redirect } from 'next/navigation';
import React from 'react'

const IndustryInsightsPage =async () => {
     const {isOnboarding} =await getUserOnboardingStatus();
        
        if(!isOnboarding){
            redirect('/onboarding');
        }
  return (
    <div>IndustryInsightsPage</div>
  )
}

export default IndustryInsightsPage