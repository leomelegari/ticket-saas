"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/hooks/use-storage-url";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { Button } from "./ui/button";
import { Loader2Icon, XIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Nome do evento obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
  location: z.string().min(1, "Local obrigatório"),
  eventDate: z
    .date()
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "A data do evento deve ser no futuro",
    ),
  price: z.number().min(0, "Preço precisa ser 0 ou maior"),
  totalTickets: z.number().int().min(1, "Deve ter pelo menos um ingresso"),
});

type FormData = z.infer<typeof formSchema>;

interface InitialEventData {
  _id: Id<"events">;
  name: string;
  description: string;
  location: string;
  eventDate: number;
  price: number;
  totalTickets: number;
  imageStorageId?: Id<"_storage">;
}

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: InitialEventData;
}

function EventForm({ mode, initialData }: EventFormProps) {
  const { user } = useUser();
  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.update);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const currentImageUrl = useStorageUrl(initialData?.imageStorageId);

  // image upload
  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateEventImage = useMutation(api.storage.updateEventImage);
  const deleteImage = useMutation(api.storage.deleteImage);

  const [removedCurrentImage, setRemovedCurrentImage] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      location: initialData?.location ?? "",
      eventDate: initialData ? new Date(initialData.eventDate) : new Date(),
      price: initialData?.price ?? 0,
      totalTickets: initialData?.totalTickets ?? 1,
    },
  });

  async function onSubmit(values: FormData) {
    if (!user?.id) {
      return;
    }

    startTransition(async () => {
      try {
        let imageStorageId = null;

        if (selectedImage) {
          imageStorageId = await handleImageUpload(selectedImage);
        }

        if (mode === "edit" && initialData?.imageStorageId) {
          if (removedCurrentImage || selectedImage) {
            await deleteImage({
              storageId: initialData.imageStorageId,
            });
          }
        }

        if (mode === "create") {
          const eventId = await createEvent({
            ...values,
            userId: user.id,
            eventDate: values.eventDate.getTime(),
          });

          if (imageStorageId) {
            await updateEventImage({
              eventId,
              storageId: imageStorageId as Id<"_storage">,
            });

            router.push(`/event/${eventId}`);
          }
          router.push(`/event/${eventId}`);
        } else {
          if (!initialData) {
            throw new Error("Initial event data is required for updates");
          }

          await updateEvent({
            eventId: initialData._id,
            ...values,
            eventDate: values.eventDate.getTime(),
          });

          if (imageStorageId || removedCurrentImage) {
            await updateEventImage({
              eventId: initialData._id,
              storageId: imageStorageId
                ? (imageStorageId as Id<"_storage">)
                : null,
            });
          }

          toast({
            title: "Evento atualizado",
            description: "Seu evento foi atualizado com sucesso!",
          });

          router.push(`/event/${initialData._id}`);
        }
      } catch (error) {
        console.log("error ", error);
        toast({
          variant: "destructive",
          title: "Huum... algo deu errado",
          description: "Houve um problema com a sua requisição.",
        });
      }
    });
  }

  async function handleImageUpload(file: File): Promise<string | null> {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.log("error ", error);
      return null;
    }
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* form fields */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do evento</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data do evento</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : null,
                      );
                    }}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço por ingresso</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2">
                      R$
                    </span>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalTickets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total de ingressos</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Image upload */}
          <div className="space-y-4">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-900"
            >
              Imagem do evento
            </label>

            <div className="mt-1 flex items-center gap-4">
              {imagePreview || (!removedCurrentImage && currentImageUrl) ? (
                <div className="relative w-32 aspect-square bg-gray-100 rounded-lg">
                  <Image
                    src={imagePreview || currentImageUrl!}
                    alt="preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      setRemovedCurrentImage(true);
                      if (imageInput.current) {
                        imageInput.current.value = "";
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full size-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <XIcon />
                  </Button>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="file"
                    className="block w-42 mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                  >
                    Escolher imagem
                  </label>
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={imageInput}
                    className="hidden"
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 font-semibold flex items-center justify-center"
        >
          {isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
              {mode === "create" ? "Criando evento" : "Atualizando evento"}
            </>
          ) : mode === "create" ? (
            "Criar evento"
          ) : (
            "Atualizar evento"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default EventForm;
