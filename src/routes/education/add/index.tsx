import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useNavigate } from '@tanstack/router'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form as FormProvider } from '@/components/ui/form'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
  course: z.string().min(1),
  school: z.string().min(1),
  start_date: z.date(),
  end_date: z.date(),
  grade: z.string().regex(/^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)%$/, { message: 'Invalid grade' }),
  logo: z.string({ required_error: 'test' }).url({ message: 'Invalid URL' })
})
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type Form = PartialBy<z.infer<typeof formSchema>, 'start_date' | 'end_date'>

export function AddEducation() {
  const navigate = useNavigate()
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course: '',
      school: '',
      grade: '',
      logo: ''
    }
  })
  const { toast } = useToast()
  const addEducation = useMutation({
    mutationFn: (data: Required<Form>) => {
      const startDate = new Date(data.start_date)
      const startMonth = startDate.toLocaleString('default', { month: 'long' })
      const startYear = startDate.getFullYear()
      const endDate = new Date(data.end_date)
      const endMonth = endDate.toLocaleString('default', { month: 'long' })
      const endYear = endDate.getFullYear()
      return fetch('/resume/education', {
        body: JSON.stringify({
          ...data,
          start_date: `${startMonth} ${startYear}`,
          end_date: `${endMonth} ${endYear}`
        }),
        method: 'POST'
      })
    },
    onSuccess(res) {
      if (res.ok) {
        void navigate({ to: '/' })
        toast({ title: 'Successfully added education' })
        return
      }

      toast({ title: 'Failed to add education' })
    }
  })

  function onSubmit(data: Form) {
    if (data.start_date && data.end_date) {
      addEducation.mutate(data as Required<Form>)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:pt-9">
      <FormProvider {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 rounded-md border-2 border-input p-8">
          <h1 className="text-4xl">Add Education</h1>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-8">
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="inline-block w-24">Start Date:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo (URL):</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={() => void navigate({ to: '/' })} className="w-fit" variant="destructive" type="button">
              Back
            </Button>
            <Button type="submit" disabled={addEducation.isLoading}>
              Create
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
