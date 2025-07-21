'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Info, Mail, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  AdminPageLayout,
  AdminSection,
} from '../../../../components/admin/layout/AdminPageLayout';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Switch } from '../../../../components/ui/switch';
import { Textarea } from '../../../../components/ui/textarea';

const emailRequestSchema = z.object({
  emailType: z.enum(['post_delivery', 'post_purchase', 'inactive_customers']),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  includeDiscountCode: z.boolean(),
  discountCode: z.string().optional(),
  discountAmount: z.string().optional(),
  targetDays: z.number().min(1, 'Days must be at least 1'),
});

type EmailRequestFormData = z.infer<typeof emailRequestSchema>;

/**
 * Feedback email requests page
 */
export default function FeedbackEmailRequestsPage() {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);
  const [emailCount, setEmailCount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EmailRequestFormData>({
    resolver: zodResolver(emailRequestSchema),
    defaultValues: {
      emailType: 'post_delivery',
      subject: 'How was your recent purchase?',
      message:
        "We hope you're enjoying your recent purchase! We'd love to hear your feedback to help us improve our products and services.",
      includeDiscountCode: false,
      targetDays: 7,
    },
  });

  const emailType = watch('emailType');
  const includeDiscountCode = watch('includeDiscountCode');

  const getEmailSubject = (type: string) => {
    switch (type) {
      case 'post_delivery':
        return 'How was your recent delivery?';
      case 'post_purchase':
        return 'How was your recent purchase?';
      case 'inactive_customers':
        return 'We miss you! Share your feedback and get a discount';
      default:
        return 'We value your feedback';
    }
  };

  const getEmailMessage = (type: string) => {
    switch (type) {
      case 'post_delivery':
        return "We hope your recent delivery went smoothly! We'd love to hear your feedback about the delivery experience to help us improve our service.";
      case 'post_purchase':
        return "We hope you're enjoying your recent purchase! We'd love to hear your feedback to help us improve our products and services.";
      case 'inactive_customers':
        return "We noticed it's been a while since your last purchase. We'd love to hear your feedback about your experience with us and what we can do better.";
      default:
        return 'We value your feedback and would appreciate if you could take a moment to share your thoughts with us.';
    }
  };

  const handleEmailTypeChange = (value: string) => {
    setValue('emailType', value as EmailRequestFormData['emailType']);
    setValue('subject', getEmailSubject(value));
    setValue('message', getEmailMessage(value));
  };

  const onSubmit = async (data: EmailRequestFormData) => {
    setIsSending(true);

    try {
      // In a real implementation, this would call the API
      console.log('Sending feedback request emails:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success
      setEmailsSent(true);
      setEmailCount(Math.floor(Math.random() * 50) + 10); // Random number between 10-60
    } catch (error) {
      console.error('Failed to send feedback request emails:', error);
      alert('Failed to send emails. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setEmailsSent(false);
    reset();
  };

  return (
    <AdminPageLayout
      title="Feedback Email Requests"
      description="Send targeted feedback request emails to customers"
      actions={
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feedback
        </Button>
      }
    >
      <AdminSection>
        {emailsSent ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Emails Sent Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              {emailCount} feedback request emails have been queued and will be
              sent shortly.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={handleReset}>Send Another Batch</Button>
              <Button variant="outline" onClick={() => router.back()}>
                Back to Feedback
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Type */}
            <div className="space-y-2">
              <Label htmlFor="emailType">Email Type</Label>
              <Select value={emailType} onValueChange={handleEmailTypeChange}>
                <SelectTrigger id="emailType">
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post_delivery">
                    Post-Delivery Feedback
                  </SelectItem>
                  <SelectItem value="post_purchase">
                    Post-Purchase Feedback
                  </SelectItem>
                  <SelectItem value="inactive_customers">
                    Re-engage Inactive Customers
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Select the type of feedback request email to send
              </p>
            </div>

            {/* Target Days */}
            <div className="space-y-2">
              <Label htmlFor="targetDays">Target Days</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="targetDays"
                  type="number"
                  min="1"
                  max="90"
                  className="w-24"
                  {...register('targetDays', { valueAsNumber: true })}
                />
                <span className="text-sm text-gray-600">
                  {emailType === 'post_delivery' && 'days after delivery'}
                  {emailType === 'post_purchase' && 'days after purchase'}
                  {emailType === 'inactive_customers' &&
                    'days since last purchase'}
                </span>
              </div>
              {errors.targetDays && (
                <p className="text-sm text-red-600">
                  {errors.targetDays.message}
                </p>
              )}
            </div>

            {/* Email Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input id="subject" {...register('subject')} />
              {errors.subject && (
                <p className="text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            {/* Email Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Email Message</Label>
              <Textarea id="message" rows={5} {...register('message')} />
              {errors.message && (
                <p className="text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            {/* Include Discount Code */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="includeDiscountCode"
                  checked={includeDiscountCode}
                  onCheckedChange={(checked) =>
                    setValue('includeDiscountCode', checked)
                  }
                />
                <Label htmlFor="includeDiscountCode">
                  Include Discount Code
                </Label>
              </div>

              {includeDiscountCode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-gray-200">
                  <div className="space-y-2">
                    <Label htmlFor="discountCode">Discount Code</Label>
                    <Input
                      id="discountCode"
                      placeholder="e.g., FEEDBACK10"
                      {...register('discountCode')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountAmount">Discount Amount</Label>
                    <Input
                      id="discountAmount"
                      placeholder="e.g., 10% OFF"
                      {...register('discountAmount')}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">About Email Requests</p>
                <p className="mt-1">
                  This will send feedback request emails to customers who match
                  the selected criteria. Emails are sent in batches to avoid
                  overwhelming the email server.
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSending}>
                {isSending ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Emails
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </AdminSection>
    </AdminPageLayout>
  );
}
