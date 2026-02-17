import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'

const Header = () => {
  return ( 
    <header className='fixed w-full bg-background/80 top-0'>
      <nav className='container mx-auto h-16 px-4 flex items-center justify-between'>
        <Link href='/'>
       <Image src={'/logo.png'} alt='sensai logi' width={100} height={100} className='px-2 h-12 py-1 w-auto object-contain'></Image>
        
        </Link>

        <div className='flex space-x-2 items-center md:space-x-4'>
           <SignedIn>
           <Link href={'/dashboard'}>
           <Button variant="outline">
            <LayoutDashboard  className='h-4 w-4'/>
           <span className='hidden md:block'>Dashboard Insights</span>
           </Button>
           </Link>
          


           <DropdownMenu>
  <DropdownMenuTrigger>
     <Button>
            <StarsIcon className='h-4 w-4'/>
           <span className='hidden md:block'>Growth Tools</span>
           <ChevronDown className='h-4 w-4'/>
           </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
      <DropdownMenuItem>
        <Link href={'/resume'} className='flex items-center gap-2'>
        <FileText className='h-4 w-4'/>
           <span className='hidden md:block'>Resume Builder</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href={'/cover-letter'} className='flex items-center gap-2'>
        <PenBox className='h-4 w-4'/>
           <span className='hidden md:block'>Cover Letter</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href={'/interview'} className='flex items-center gap-2'>
        <GraduationCap className='h-4 w-4'/>
           <span className='hidden md:block'>Interview</span>
        </Link>
      </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
 </SignedIn>

                 <SignedOut>
                 <SignInButton>
                  <Button variant="outline">Sign in</Button>
                 </SignInButton>
              
                </SignedOut>
                <SignedIn>
                 <UserButton 
                 appearance={
                  {
                    elements:{
                      avatarBox:'w-10 h-10',
                      userButtonPopoverCard:"shadow-xl",
                      userPreviewMainIdentifier:'font-semibold'
                    }  
                  }

                 }
                 afterSwitchSessionUrl='/'/>
              
                </SignedIn>
      </div>
  
      </nav>

      

    </header>
  
              

              
   
  )
}

export default Header