'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import {
  Battery,
  Calculator,
  Calendar,
  Camera,
  Clock,
  Image,
  MessagesSquareIcon as Messages,
  Music,
  Phone,
  Settings,
  Signal,
  Wifi,
} from 'lucide-react'
import { useState } from 'react'

interface PhoneSimulatorProps {
  images?: string[]
}

export default function PhoneSimulator({ images = [] }: PhoneSimulatorProps) {
  return (
    <div className="flex items-center justify-center py-8">
      {/* Phone Container */}
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-80 h-[640px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
            {/* Screen Content */}
            <div className="w-full h-full bg-gradient-to-b from-blue-50 to-white relative">
              {/* Status Bar */}
              <div className="flex justify-between items-center px-6 py-3 text-black">
                <div className="flex items-center gap-1">
                  <Signal className="w-4 h-4" />
                  <Wifi className="w-4 h-4" />
                </div>
                <div className="text-sm font-medium">9:41 AM</div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">100%</span>
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl flex items-center justify-center">
                <div className="w-12 h-1 bg-gray-800 rounded-full"></div>
              </div>

              {/* Carousel Container */}
              <div className="px-0 py-4 h-[calc(100%-80px)]">
                <Carousel className="w-full h-full">
                  <CarouselContent className="h-full">
                    {(images.length > 0 ? images : [1, 2, 3, 4, 5, 6]).map((img, idx) => (
                      <CarouselItem
                        key={idx}
                        className="bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden"
                      >
                        {typeof img === 'string' ? (
                          <img
                            src={`data:image/png;base64,${img}`}
                            alt={`Generated scene ${idx + 1}`}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Image className="w-8 h-8 text-white" />
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2" />
                  <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2" />
                </Carousel>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Side Buttons */}
        <div className="absolute left-0 top-24 w-1 h-12 bg-gray-800 rounded-r-sm"></div>
        <div className="absolute left-0 top-40 w-1 h-8 bg-gray-800 rounded-r-sm"></div>
        <div className="absolute left-0 top-52 w-1 h-8 bg-gray-800 rounded-r-sm"></div>
        <div className="absolute right-0 top-32 w-1 h-16 bg-gray-800 rounded-l-sm"></div>

        {/* Camera */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  )
}
