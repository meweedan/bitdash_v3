import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, isPast } from 'date-fns';
import { Trash2, Copy, Link as LinkIcon, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const PaymentLinksList = ({ merchantId }) => {
  const queryClient = useQueryClient();
  const [expandedLinks, setExpandedLinks] = useState(new Set());

  const { data: links, isLoading } = useQuery({
    queryKey: ['payment-links', merchantId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-links?` +
        `filters[merchant][id][$eq]=${merchantId}&` +
        `populate=*&` +
        `sort[0]=createdAt:desc`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch payment links');
      return response.json();
    },
    enabled: !!merchantId
  });

  const deleteMutation = useMutation({
    mutationFn: async (linkId) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-links/${linkId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to delete payment link');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payment-links']);
    }
  });

  const toggleExpand = (linkId) => {
    setExpandedLinks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(linkId)) {
        newSet.delete(linkId);
      } else {
        newSet.add(linkId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bitcash-500"></div>
      </div>
    );
  }

  if (!links?.data?.length) {
    return (
      <div className="text-gray-500 text-center p-4">
        No payment links found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.data.map((link) => (
        <PaymentLinkItem 
          key={link.id} 
          link={link}
          isExpanded={expandedLinks.has(link.id)}
          onToggle={() => toggleExpand(link.id)}
          onDelete={() => deleteMutation.mutate(link.id)}
        />
      ))}
    </div>
  );
};

const PaymentLinkItem = ({ link, isExpanded, onToggle, onDelete }) => {
  const { attributes } = link;
  const paymentUrl = `https://cash.bitdash.app/${attributes.metadata?.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '-')}/${attributes.link_id}`;
  const isExpired = attributes.expiry ? isPast(new Date(attributes.expiry)) : false;
  
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(paymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                ${isExpired 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : attributes.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                {isExpired ? 'EXPIRED' : attributes.status.toUpperCase()}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {attributes.payment_type}
              </span>
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">
              {attributes.amount.toLocaleString()} {attributes.currency}
            </span>
            <span className="text-sm text-gray-500">
              {format(parseISO(attributes.createdAt), 'MMM d, h:mm a')}
            </span>
          </div>

          {isExpanded && (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-gray-500">Payment Link:</span>
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                  <LinkIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm flex-1 truncate">{paymentUrl}</span>
                  <button
                    onClick={handleCopy}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title={copied ? 'Copied!' : 'Copy link'}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {attributes.expiry && (
                <div className="text-sm text-gray-500">
                  Expires: {format(parseISO(attributes.expiry), 'MMM d, h:mm a')}
                </div>
              )}

              {attributes.description && (
                <div className="text-sm">
                  <span className="text-gray-500">Description:</span>
                  <p className="mt-1">{attributes.description}</p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onDelete}
                  className="flex items-center space-x-1 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentLinksList;