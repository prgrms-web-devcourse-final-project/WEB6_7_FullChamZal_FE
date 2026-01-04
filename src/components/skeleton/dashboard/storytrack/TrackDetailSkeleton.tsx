export default function TrackDetailSkeleton() {
  return (
    <>
      <div className="min-h-dvh lg:h-screen flex flex-col p-4 lg:p-8 gap-4 lg:gap-8 animate-pulse">
        <div className="flex-none">
          <div className="w-24 h-10 rounded-xl bg-gray-200" />
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-0">
          {/* Left */}
          <div className="lg:flex-1 lg:min-w-80 flex flex-col gap-4 lg:gap-6 min-h-0">
            <div className="h-44 sm:h-56 lg:h-64 rounded-2xl bg-gray-200" />

            <div className="border border-outline rounded-2xl lg:flex-1 lg:min-h-0 overflow-hidden bg-white/80">
              <div className="p-6 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {/* title */}
                      <div className="h-7 w-2/3 rounded-lg bg-gray-200" />

                      {/* badges */}
                      <div className="flex gap-2">
                        <div className="h-9 w-24 rounded-full bg-gray-200" />
                        <div className="h-9 w-24 rounded-full bg-gray-200" />
                      </div>

                      {/* participants */}
                      <div className="h-4 w-40 rounded bg-gray-200" />
                    </div>

                    <div className="w-full h-px bg-outline" />

                    {/* description */}
                    <div className="space-y-3">
                      <div className="h-4 w-16 rounded bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-gray-200" />
                        <div className="h-4 w-11/12 rounded bg-gray-200" />
                        <div className="h-4 w-9/12 rounded bg-gray-200" />
                      </div>

                      {/* creator */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div className="space-y-2">
                          <div className="h-4 w-24 rounded bg-gray-200" />
                          <div className="h-3 w-16 rounded bg-gray-200" />
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-outline" />

                    {/* createdAt */}
                    <div className="h-4 w-40 rounded bg-gray-200" />
                  </div>
                </div>

                {/* buttons */}
                <div className="pt-4">
                  <div className="h-12 w-full rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:flex-3 flex flex-col gap-4 lg:gap-6 min-h-0">
            <div className="border border-outline rounded-2xl overflow-hidden">
              <div className="h-24 bg-gray-200" />
            </div>

            <div className="h-150 border border-outline rounded-2xl overflow-hidden flex flex-col lg:flex-1 lg:min-h-0 bg-gray-200"></div>
          </div>
        </div>
      </div>
    </>
  );
}
