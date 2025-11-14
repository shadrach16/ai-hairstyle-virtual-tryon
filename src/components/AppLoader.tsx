// src/components/AppLoader.tsx

import React from 'react';

export default function AppLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center text-center">
        {/* Your App Logo and Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 border border-gray-300 rounded-xl flex items-center justify-center">
            {/* You can reuse your logo's SVG here */}
            <svg className="w-11 h-11 rounded-xl" viewBox="0 0 512 512" fill="#000000">
              <g>
                <path d="M221.982,283.066c-6.309,10.672-10.869,23.479-10.869,37.743c0,33.534,22.459,60.725,50.163,60.725 c27.705,0,49.512-20.462,50.832-55.444c0.514-13.673-2.64-29.051-10.715-41.738c-9.72-15.318-21.944-21.045-26.247-41.437 c-19.802-93.728-65.774-225.951-93.496-231.231c9.54,14.307,43.846,152.891,51.252,237.831 C234.514,268.065,228.942,271.305,221.982,283.066z"></path>
                <path d="M297.27,186.853c-8.161,0-4.492,17.796,6.549,38.395c3.36,6.283,6.24,9.104,13.149,16.93 c4.218,4.8,9.49,10.783,14.461,18.601c11.503,18.104,17.367,40.632,16.51,63.416c-2.006,53.044-37.392,90.11-86.063,90.11 c-47.044,0-85.326-43.572-85.326-97.104c0-19.656,5.452-38.84,16.201-57.039c1.928-3.248,3.729-5.966,5.177-8.16 c1.106-1.672,2.777-4.192,3-4.843c0.009-0.009,1.466-4.586,3.574-9.421c10.295-23.538,8.829-50.884-19.124-50.884H0v313.463h512 V186.853H297.27z"></path>
              </g>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-amber-500">Hair Studio</h1>
            <p className="text-sm text-slate-500 -mt-1">Try-On Studio</p>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="mt-8">
          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}