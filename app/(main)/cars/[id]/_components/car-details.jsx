"use client";
import { toggleSavedCar } from "@/actions/car-listing";
import useFetch from "@/hooks/use-fetch";
import { useAuth } from "@clerk/clerk-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Car, Currency, Fuel, Gauge, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/helper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import EmiCalculator from "./emi-calcultor";

const CarDetails = ({ car, testDriveInfo }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(car.wishlisted);

  const {
    loading: savingCar,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  // Handle toggle result with useEffect
  useEffect(() => {
    if (toggleResult?.success) {
      setIsWishlisted(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult]);

  // Handle errors with useEffect
  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to update favorites");
    }
  }, [toggleError]);

  // Handle save car
  const handleSaveCar = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      router.push("/sign-in");
      return;
    }

    if (savingCar) return;

    // Use the toggleSavedCarFn from useFetch hook
    await toggleSavedCarFn(car.id);
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${car.year} ${car.make} ${car.model}`,
          text: `Check out this ${car.year} ${car.make} ${car.model} on Vehiql!`,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("Error sharing", error);
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery */}
        <div className="w-full lg:w-7/12">
          <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
            {car.images && car.images.length > 0 ? (
              <Image
                src={car.images[currentImageIndex]}
                alt={`${car.year} ${car.make} ${car.model}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Car className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {car.images && car.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {car.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-md h-20 w-24 flex-shrink-0 transition ${
                    index === currentImageIndex
                      ? "border-2 border-blue-600"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${car.year} ${car.make} ${car.model} - view ${
                      index + 1
                    }`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Secondary Actions */}
          <div className="flex mt-4 gap-4">
            <Button
              variant="outline"
              className={`flex items-center gap-2 flex-1 ${
                isWishlisted ? "text-red-500" : ""
              }`}
              onClick={handleSaveCar}
              disabled={savingCar}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`}
              />
              {isWishlisted ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 flex-1"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              Share
            </Button>
          </div>
        </div>

        {/* Car Details */}
        <div className="w-full lg:w-5/12">
          <div className="flex items-center justify-between">
            <Badge className="mb-2">{car.bodyType}</Badge>
          </div>

          <h1 className="text-4xl font-bold mb-1">
            {car.year} {car.make} {car.model}
          </h1>

          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(car.price)}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <div className="flex items-center gap-2">
              <Gauge className="text-gray-500 h-5 w-5" />
              <span>{car.mileage.toLocaleString()} miles</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="text-gray-500 h-5 w-5" />
              <span>{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="text-gray-500 h-5 w-5" />
              <span>{car.transmission}</span>
            </div>
          </div>
          <Dialog>
            <DialogTrigger className="w-full text-start">
              <Card className="pt-5">
                <CardContent>
                  <div className="flex items-center gap-2 text-lg font-medium mb-2">
                    <Currency className="h-5 w-5 text-blue-600" />
                    <h3>EMI Calculator</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    Estimated Monthly Payment:{" "}
                    <span className="font-bold text-gray-900">
                      {formatCurrency(car.price / 60)}
                    </span>{" "}
                    for 60 months
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    *Based on $0 down payment and 4.5% interest rate
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vehiql Car Loan Calculator</DialogTitle>
                <EmiCalculator price={car.price} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
